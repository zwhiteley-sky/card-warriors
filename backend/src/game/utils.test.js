const { compare_cards } = require("./utils");

test("card comparison for host", () => {
    const host_cards = [
        { rarity: "legendary" },
        { rarity: "uncommon" },
        { rarity: "epic" },
    ];

    const join_cards = [
        { rarity: "common" },
        { rarity: "epic" },
        { rarity: "rare" },
    ];

    expect(compare_cards(host_cards, join_cards)).toBe("host");
});

test("card comparison for join", () => {
    const host_cards = [
        { rarity: "uncommon" },
        { rarity: "uncommon" },
        { rarity: "rare" },
    ];

    const join_cards = [
        { rarity: "rare" },
        { rarity: "rare" },
        { rarity: "uncommon" },
    ];

    expect(compare_cards(host_cards, join_cards)).toBe("join");
});

test("card comparison draw", () => {
       const host_cards = [
        { rarity: "legendary" },
        { rarity: "uncommon" },
        { rarity: "rare" },
    ];

    const join_cards = [
        { rarity: "epic" },
        { rarity: "epic" },
        { rarity: "uncommon" },
    ];

    expect(compare_cards(host_cards, join_cards)).toBeUndefined();
});