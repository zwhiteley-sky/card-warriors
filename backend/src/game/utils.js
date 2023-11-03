/**
 * Compare two triples of cards to determine the winner.
 * @param {*[]} host_cards - The host's cards.
 * @param {*[]} join_cards - The joiner's cards.
 */
function compare_cards(host_cards, join_cards) {
    let points = 0;

    host_cards = host_cards.sort((a, b) => numerify(b) - numerify(a))
    join_cards = join_cards.sort((a, b) => numerify(b) - numerify(a))

    for (let i = 0; i < host_cards.length; ++i) {
        const host_card = host_cards[i];
        const join_card = join_cards[i];

        if (numerify(host_card) > numerify(join_card)) {
            ++points;
        } else if (numerify(join_card) > numerify(host_card)) {
            --points;
        }
    }

    if (points > 0) return "host";
    else if (points < 0) return "join";
    else return undefined;
}

function numerify(card) {
    const rarities = ["common", "uncommon", "rare", "epic", "legendary"];
    return rarities.indexOf(card.rarity);
}

module.exports = {
    compare_cards,
    numerify
};