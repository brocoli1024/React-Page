import { addUserPoints, getUserPoints, spendUserPoints } from './localDatabase';

describe('loyalty points helpers', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it('adds and spends points for a specific user', () => {
        expect(getUserPoints('alice')).toBe(0);

        addUserPoints('alice', 120);
        expect(getUserPoints('alice')).toBe(120);

        const result = spendUserPoints('alice', 100);
        expect(result.success).toBe(true);
        expect(result.points).toBe(20);
        expect(getUserPoints('alice')).toBe(20);
    });

    it('prevents spending more points than available', () => {
        addUserPoints('bob', 50);

        const result = spendUserPoints('bob', 100);
        expect(result.success).toBe(false);
        expect(result.points).toBe(50);
        expect(getUserPoints('bob')).toBe(50);
    });
});
