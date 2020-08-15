const id = [
    213513, // Yung Beef
    2109193, // Young Palmera
    572681, // GOA
    589212, // Kaydy Cain
    1006913, // Khaled
    1584157, // Albany
    1034789, // La Zowi
    540389, // Takers
    1761506, // Louis9k
    1450842, // Bea Pelea
    626432, // La Goony Chonga
    463998, // Dellafuente
    1442194, // Papi Trujillo
    1338048, // MC Buzzz
    615608, // Israel B
    585297, // Cecilio G
    1091094, // Space Surimi
    1239974 // Scarface Johannson
    
];

const getRandomArtist = () => id[Math.floor(Math.random() * id.length)]

module.exports = {
    id,
    getRandomArtist
}