import { project } from './projection'

describe('projection', () => {
  it('should project a point', () => {
    // expect(project([180, 0])).toEqual([0.5, 0.5])
    expect(project([-84.326625, 30.360120])).toEqual([0.5, 0.5])

    /*
    +   -8205260.277934642,
    +   8941801.874970153,

    */
  })
})
