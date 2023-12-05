export default function getRandomColors() {
    const excludedShades = ['000000', 'ffffff', '888888', '777777', '666666', '555555'];

    let bgColor;
    let fgColor;

    do {
        bgColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    } 
    while (excludedShades.includes(bgColor.toLowerCase()));

    // Calculate the brightness of the background color
    const hexColor = bgColor.substring(1); // Remove the "#" character
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Choose text color based on background brightness
    if (brightness > 110) {
        fgColor = '#333E52'; // Use black text for light backgrounds
    } else {
        fgColor = '#ffffff'; // Use white text for dark backgrounds
    }
    return { bgColor, fgColor };
}