export const artists = {
    id: [
        // Insert artists id
    ],
    getRandomArtist: (): number => artists.id[Math.floor(Math.random() * artists.id.length)]
}