const scene = document.querySelector("#scene");

const spheres = [
    {
        element: document.querySelector(".sphere-1"),

        radiusX: 520,
        radiusY: 135,

        depth: 260,

        speed: 0.00028,

        offset: 0.2,

        tiltX: 0.25,
        tiltY: 0.1
    },

    {
        element: document.querySelector(".sphere-2"),

        radiusX: 360,
        radiusY: 220,

        depth: 330,

        speed: -0.00038,

        offset: Math.PI * 0.9,

        tiltX: 0.6,
        tiltY: -0.25
    },

    {
        element: document.querySelector(".sphere-3"),

        radiusX: 570,
        radiusY: 95,

        depth: 190,

        speed: 0.00021,

        offset: Math.PI * 1.45,

        tiltX: -0.15,
        tiltY: 0.3
    }
];


let targetMouseX = 0;
let targetMouseY = 0;

let currentMouseX = 0;
let currentMouseY = 0;


window.addEventListener("mousemove", event => {

    targetMouseX =
        (event.clientX / window.innerWidth - 0.5) * 2;

    targetMouseY =
        (event.clientY / window.innerHeight - 0.5) * 2;

});


window.addEventListener("mouseleave", () => {

    targetMouseX = 0;
    targetMouseY = 0;

});


function getResponsiveFactor() {

    if (window.innerWidth <= 500) {
        return 0.34;
    }

    if (window.innerWidth <= 900) {
        return 0.55;
    }

    if (window.innerWidth <= 1200) {
        return 0.78;
    }

    return 1;

}


function animate(time) {

    const responsiveFactor = getResponsiveFactor();


    currentMouseX +=
        (targetMouseX - currentMouseX) * 0.025;

    currentMouseY +=
        (targetMouseY - currentMouseY) * 0.025;


    scene.style.transform = `
        rotateY(${currentMouseX * 2.5}deg)
        rotateX(${currentMouseY * -2}deg)
    `;


    spheres.forEach((sphere, index) => {

        const angle =
            time * sphere.speed + sphere.offset;


        /*
        Bazowa eliptyczna orbita
        */

        const baseX =
            Math.cos(angle) *
            sphere.radiusX *
            responsiveFactor;

        const baseY =
            Math.sin(angle) *
            sphere.radiusY *
            responsiveFactor;


        /*
        Głębokość sceny
        */

        const z =
            Math.sin(angle + sphere.tiltX) *
            sphere.depth;


        /*
        Dodatkowe lekkie odchylenie,
        żeby ruch nie wyglądał idealnie
        geometrycznie
        */

        const secondaryMotion =
            Math.sin(angle * 1.7 + index) *
            22 *
            responsiveFactor;


        const tertiaryMotion =
            Math.cos(angle * 1.3 + index) *
            13 *
            responsiveFactor;


        const x =
            baseX + secondaryMotion;

        const y =
            baseY + tertiaryMotion;


        /*
        Głębia od 0 do 1
        */

        const depthNormalized =
            Math.max(
                0,
                Math.min(
                    1,
                    (z + sphere.depth) /
                    (sphere.depth * 2)
                )
            );


        /*
        Kulka z przodu większa,
        z tyłu mniejsza
        */

        const scale =
            0.62 +
            depthNormalized * 0.62;


        /*
        Delikatny blur z tyłu
        */

        const blur =
            (1 - depthNormalized) * 1.8;


        /*
        Tylne kulki nieco ciemniejsze
        */

        const opacity =
            0.42 +
            depthNormalized * 0.58;


        sphere.element.style.transform = `
            translate3d(
                ${x}px,
                ${y}px,
                ${z}px
            )
            scale(${scale})
        `;


        sphere.element.style.filter =
            `blur(${blur}px)`;

        sphere.element.style.opacity =
            opacity;


        /*
        Przechodzenie przed i za napisem
        */

        if (z > 20) {

            sphere.element.style.zIndex = "10";

        } else {

            sphere.element.style.zIndex = "2";

        }

    });


    requestAnimationFrame(animate);

}


requestAnimationFrame(animate);