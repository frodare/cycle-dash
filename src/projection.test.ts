import { project } from './projection'

describe('projection', () => {
  it('should project a point', () => {
    expect(project([0, 0])).toEqual([0.5, 0.5])
  })
})
