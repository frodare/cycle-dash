import { project, unproject } from './projection'

describe('projection', () => {
  it('should project a point', () => {
    expect(project([0, 0]).map(Math.round)).toEqual([0, 0])
    expect(project([1, 1]).map(Math.round)).toEqual([111319, -111325])
    expect(unproject(project([1, 0]))).toEqual([1, 0])
  })
})
