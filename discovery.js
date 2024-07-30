document.addEventListener("DOMContentLoaded", function () {
    const rays = document.querySelector('.rays');
    const numRays = 15;
    const degreesPerRay = 360 / numRays;

    let conicGradient = 'conic-gradient(from 0deg, ';

    for (let i = 0; i < numRays; i++) {
        const startAngle = i * degreesPerRay;
        const endAngle = startAngle + degreesPerRay * 0.2;
        conicGradient += `transparent ${startAngle}deg, rgba(0, 0, 0, 0.5) ${startAngle}deg, rgba(0, 0, 0, 0.5) ${endAngle}deg, transparent ${endAngle}deg`;
        if (i < numRays - 1) {
            conicGradient += ', ';
        }
    }

    conicGradient += ')';
    rays.style.background = conicGradient;
});