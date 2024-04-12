import * as random from './random'
import {jest, test, expect, beforeEach} from "@jest/globals"; // this is optional, all three are global variables im runner scope

import {randomRGBColor} from './color'

let mockFn = jest.fn();
random.randomInt = mockFn

beforeEach(()=>{
    mockFn = mockFn
        .mockReturnValue(0)
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(150)
        .mockReturnValueOnce(200);
})

test ('Random color generates 3-tuple', () => {

    const color = randomRGBColor();
    const [red, green, blue] = color

    expect(red).toBeGreaterThanOrEqual(100);
    expect(green).toBeGreaterThanOrEqual(150);
    expect(blue).toBeGreaterThanOrEqual(200);

    expect(mockFn).toHaveBeenCalledTimes(3);
});
