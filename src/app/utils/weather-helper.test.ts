// Local imports
import { formatWindDirection, getBeaufortScale } from "./weather-helper";

describe("Weather Helper Functions", () => {
  describe("formatWindDirection", () => {
    describe("Cardinal Directions", () => {
      it("returns North for 0 degrees", () => {
        expect(formatWindDirection(0)).toBe("N");
      });

      it("returns East for 90 degrees", () => {
        expect(formatWindDirection(90)).toBe("E");
      });

      it("returns South for 180 degrees", () => {
        expect(formatWindDirection(180)).toBe("S");
      });

      it("returns West for 270 degrees", () => {
        expect(formatWindDirection(270)).toBe("W");
      });
    });

    describe("Intercardinal Directions", () => {
      it("returns Northeast for 45 degrees", () => {
        expect(formatWindDirection(45)).toBe("NE");
      });

      it("returns Southeast for 135 degrees", () => {
        expect(formatWindDirection(135)).toBe("SE");
      });

      it("returns Southwest for 225 degrees", () => {
        expect(formatWindDirection(225)).toBe("SW");
      });

      it("returns Northwest for 315 degrees", () => {
        expect(formatWindDirection(315)).toBe("NW");
      });
    });

    describe("Secondary Intercardinal Directions", () => {
      it("returns North-Northeast for 22.5 degrees", () => {
        expect(formatWindDirection(22.5)).toBe("NNE");
      });

      it("returns East-Northeast for 67.5 degrees", () => {
        expect(formatWindDirection(67.5)).toBe("ENE");
      });

      it("returns East-Southeast for 112.5 degrees", () => {
        expect(formatWindDirection(112.5)).toBe("ESE");
      });

      it("returns South-Southeast for 157.5 degrees", () => {
        expect(formatWindDirection(157.5)).toBe("SSE");
      });

      it("returns South-Southwest for 202.5 degrees", () => {
        expect(formatWindDirection(202.5)).toBe("SSW");
      });

      it("returns West-Southwest for 247.5 degrees", () => {
        expect(formatWindDirection(247.5)).toBe("WSW");
      });

      it("returns West-Northwest for 292.5 degrees", () => {
        expect(formatWindDirection(292.5)).toBe("WNW");
      });

      it("returns North-Northwest for 337.5 degrees", () => {
        expect(formatWindDirection(337.5)).toBe("NNW");
      });
    });

    describe("Boundary and Edge Cases", () => {
      it("handles negative degrees by wrapping around", () => {
        expect(formatWindDirection(-90)).toBe("W");
        expect(formatWindDirection(-180)).toBe("S");
        expect(formatWindDirection(-270)).toBe("E");
      });

      it("handles degrees over 360 by wrapping around", () => {
        expect(formatWindDirection(450)).toBe("E");
        expect(formatWindDirection(540)).toBe("S");
        expect(formatWindDirection(630)).toBe("W");
      });

      it("handles decimal degrees correctly", () => {
        expect(formatWindDirection(0.1)).toBe("N");
        expect(formatWindDirection(89.9)).toBe("E");
        expect(formatWindDirection(179.9)).toBe("S");
        expect(formatWindDirection(269.9)).toBe("W");
      });

      it("handles very large numbers", () => {
        expect(formatWindDirection(720)).toBe("N");
        expect(formatWindDirection(1080)).toBe("N");
      });

      it("handles very small negative numbers", () => {
        expect(formatWindDirection(-0.1)).toBe("N");
        expect(formatWindDirection(-360.1)).toBe("N");
      });
    });

    describe("Rounding Behavior", () => {
      it("rounds to nearest direction correctly", () => {
        expect(formatWindDirection(11)).toBe("N");
        expect(formatWindDirection(12)).toBe("NNE");
        expect(formatWindDirection(33)).toBe("NNE");
        expect(formatWindDirection(34)).toBe("NE");
      });

      it("handles exact boundary values", () => {
        expect(formatWindDirection(22.5)).toBe("NNE");
        expect(formatWindDirection(45)).toBe("NE");
        expect(formatWindDirection(67.5)).toBe("ENE");
        expect(formatWindDirection(90)).toBe("E");
      });
    });
  });

  describe("getBeaufortScale", () => {
    describe("Calm Conditions", () => {
      it("returns Force 0 for very low speeds", () => {
        expect(getBeaufortScale(0)).toEqual({ force: 0, description: "Calm" });
        expect(getBeaufortScale(0.1)).toEqual({
          force: 0,
          description: "Calm",
        });
        expect(getBeaufortScale(0.29)).toEqual({
          force: 0,
          description: "Calm",
        });
      });
    });

    describe("Light Air", () => {
      it("returns Force 1 for light air conditions", () => {
        expect(getBeaufortScale(0.3)).toEqual({
          force: 1,
          description: "Light Air",
        });
        expect(getBeaufortScale(1.0)).toEqual({
          force: 1,
          description: "Light Air",
        });
        expect(getBeaufortScale(1.59)).toEqual({
          force: 1,
          description: "Light Air",
        });
      });
    });

    describe("Light Breeze", () => {
      it("returns Force 2 for light breeze conditions", () => {
        expect(getBeaufortScale(1.6)).toEqual({
          force: 2,
          description: "Light Breeze",
        });
        expect(getBeaufortScale(2.5)).toEqual({
          force: 2,
          description: "Light Breeze",
        });
        expect(getBeaufortScale(3.39)).toEqual({
          force: 2,
          description: "Light Breeze",
        });
      });
    });

    describe("Gentle Breeze", () => {
      it("returns Force 3 for gentle breeze conditions", () => {
        expect(getBeaufortScale(3.4)).toEqual({
          force: 3,
          description: "Gentle Breeze",
        });
        expect(getBeaufortScale(4.5)).toEqual({
          force: 3,
          description: "Gentle Breeze",
        });
        expect(getBeaufortScale(5.49)).toEqual({
          force: 3,
          description: "Gentle Breeze",
        });
      });
    });

    describe("Moderate Breeze", () => {
      it("returns Force 4 for moderate breeze conditions", () => {
        expect(getBeaufortScale(5.5)).toEqual({
          force: 4,
          description: "Moderate Breeze",
        });
        expect(getBeaufortScale(6.5)).toEqual({
          force: 4,
          description: "Moderate Breeze",
        });
        expect(getBeaufortScale(7.99)).toEqual({
          force: 4,
          description: "Moderate Breeze",
        });
      });
    });

    describe("Fresh Breeze", () => {
      it("returns Force 5 for fresh breeze conditions", () => {
        expect(getBeaufortScale(8.0)).toEqual({
          force: 5,
          description: "Fresh Breeze",
        });
        expect(getBeaufortScale(9.5)).toEqual({
          force: 5,
          description: "Fresh Breeze",
        });
        expect(getBeaufortScale(10.79)).toEqual({
          force: 5,
          description: "Fresh Breeze",
        });
      });
    });

    describe("Strong Breeze", () => {
      it("returns Force 6 for strong breeze conditions", () => {
        expect(getBeaufortScale(10.8)).toEqual({
          force: 6,
          description: "Strong Breeze",
        });
        expect(getBeaufortScale(12.0)).toEqual({
          force: 6,
          description: "Strong Breeze",
        });
        expect(getBeaufortScale(13.89)).toEqual({
          force: 6,
          description: "Strong Breeze",
        });
      });
    });

    describe("Near Gale", () => {
      it("returns Force 7 for near gale conditions", () => {
        expect(getBeaufortScale(13.9)).toEqual({
          force: 7,
          description: "Near Gale",
        });
        expect(getBeaufortScale(15.5)).toEqual({
          force: 7,
          description: "Near Gale",
        });
        expect(getBeaufortScale(17.19)).toEqual({
          force: 7,
          description: "Near Gale",
        });
      });
    });

    describe("Gale", () => {
      it("returns Force 8 for gale conditions", () => {
        expect(getBeaufortScale(17.2)).toEqual({
          force: 8,
          description: "Gale",
        });
        expect(getBeaufortScale(19.0)).toEqual({
          force: 8,
          description: "Gale",
        });
        expect(getBeaufortScale(20.79)).toEqual({
          force: 8,
          description: "Gale",
        });
      });
    });

    describe("Strong Gale", () => {
      it("returns Force 9 for strong gale conditions", () => {
        expect(getBeaufortScale(20.8)).toEqual({
          force: 9,
          description: "Strong Gale",
        });
        expect(getBeaufortScale(22.5)).toEqual({
          force: 9,
          description: "Strong Gale",
        });
        expect(getBeaufortScale(24.49)).toEqual({
          force: 9,
          description: "Strong Gale",
        });
      });
    });

    describe("Storm", () => {
      it("returns Force 10 for storm conditions", () => {
        expect(getBeaufortScale(24.5)).toEqual({
          force: 10,
          description: "Storm",
        });
        expect(getBeaufortScale(26.5)).toEqual({
          force: 10,
          description: "Storm",
        });
        expect(getBeaufortScale(28.49)).toEqual({
          force: 10,
          description: "Storm",
        });
      });
    });

    describe("Violent Storm", () => {
      it("returns Force 11 for violent storm conditions", () => {
        expect(getBeaufortScale(28.5)).toEqual({
          force: 11,
          description: "Violent Storm",
        });
        expect(getBeaufortScale(30.5)).toEqual({
          force: 11,
          description: "Violent Storm",
        });
        expect(getBeaufortScale(32.69)).toEqual({
          force: 11,
          description: "Violent Storm",
        });
      });
    });

    describe("Hurricane", () => {
      it("returns Force 12 for hurricane conditions", () => {
        expect(getBeaufortScale(32.7)).toEqual({
          force: 12,
          description: "Hurricane",
        });
        expect(getBeaufortScale(40.0)).toEqual({
          force: 12,
          description: "Hurricane",
        });
        expect(getBeaufortScale(50.0)).toEqual({
          force: 12,
          description: "Hurricane",
        });
      });
    });

    describe("Boundary and Edge Cases", () => {
      it("handles negative wind speeds", () => {
        expect(getBeaufortScale(-1)).toEqual({ force: 0, description: "Calm" });
        expect(getBeaufortScale(-10)).toEqual({
          force: 0,
          description: "Calm",
        });
      });

      it("handles decimal wind speeds", () => {
        expect(getBeaufortScale(3.7)).toEqual({
          force: 3,
          description: "Gentle Breeze",
        });
        expect(getBeaufortScale(8.5)).toEqual({
          force: 5,
          description: "Fresh Breeze",
        });
        expect(getBeaufortScale(12.3)).toEqual({
          force: 6,
          description: "Strong Breeze",
        });
      });

      it("handles very high wind speeds", () => {
        expect(getBeaufortScale(100)).toEqual({
          force: 12,
          description: "Hurricane",
        });
        expect(getBeaufortScale(200)).toEqual({
          force: 12,
          description: "Hurricane",
        });
      });

      it("handles exact boundary values", () => {
        expect(getBeaufortScale(0.3)).toEqual({
          force: 1,
          description: "Light Air",
        });
        expect(getBeaufortScale(1.6)).toEqual({
          force: 2,
          description: "Light Breeze",
        });
        expect(getBeaufortScale(3.4)).toEqual({
          force: 3,
          description: "Gentle Breeze",
        });
        expect(getBeaufortScale(5.5)).toEqual({
          force: 4,
          description: "Moderate Breeze",
        });
        expect(getBeaufortScale(8.0)).toEqual({
          force: 5,
          description: "Fresh Breeze",
        });
        expect(getBeaufortScale(10.8)).toEqual({
          force: 6,
          description: "Strong Breeze",
        });
        expect(getBeaufortScale(13.9)).toEqual({
          force: 7,
          description: "Near Gale",
        });
        expect(getBeaufortScale(17.2)).toEqual({
          force: 8,
          description: "Gale",
        });
        expect(getBeaufortScale(20.8)).toEqual({
          force: 9,
          description: "Strong Gale",
        });
        expect(getBeaufortScale(24.5)).toEqual({
          force: 10,
          description: "Storm",
        });
        expect(getBeaufortScale(28.5)).toEqual({
          force: 11,
          description: "Violent Storm",
        });
        expect(getBeaufortScale(32.7)).toEqual({
          force: 12,
          description: "Hurricane",
        });
      });
    });

    describe("Data Accuracy", () => {
      it("returns correct force and description pairs", () => {
        const testCases = [
          { speed: 0, expected: { force: 0, description: "Calm" } },
          { speed: 1, expected: { force: 1, description: "Light Air" } },
          { speed: 3, expected: { force: 2, description: "Light Breeze" } },
          { speed: 5, expected: { force: 3, description: "Gentle Breeze" } },
          { speed: 7, expected: { force: 4, description: "Moderate Breeze" } },
          { speed: 9, expected: { force: 5, description: "Fresh Breeze" } },
          { speed: 12, expected: { force: 6, description: "Strong Breeze" } },
          { speed: 15, expected: { force: 7, description: "Near Gale" } },
          { speed: 19, expected: { force: 8, description: "Gale" } },
          { speed: 23, expected: { force: 9, description: "Strong Gale" } },
          { speed: 26, expected: { force: 10, description: "Storm" } },
          { speed: 30, expected: { force: 11, description: "Violent Storm" } },
          { speed: 35, expected: { force: 12, description: "Hurricane" } },
        ];

        testCases.forEach(({ speed, expected }) => {
          expect(getBeaufortScale(speed)).toEqual(expected);
        });
      });
    });
  });
});
