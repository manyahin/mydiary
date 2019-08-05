import { mount } from 'vue-test-utils'
import WritePage from '@/components/WritePage'

jest.mock('axios', () => {
  return {
    get: (url, data) => {
      return Promise.resolve({ data: [{
        '_id': '5b82b7deebed70001022fb70',
        'created_at': '2018-08-26T14:23:26.788Z',
        'body': 'Hello, this is my first note.'
      }, {
        '_id': '5b83f4da7de47a00108ca568',
        'created_at': '2018-08-27T12:55:54.947Z',
        'body': 'Test for iPhone 7'
      }, {
        '_id': '5b83f4e57de47a00108ca569',
        'created_at': '2018-08-27T12:56:05.632Z',
        'body': 'Uh. Looks work!'
      }]})
    },
    post: (url, data) => {
      return Promise.resolve({ data: {
        '_id': Math.random(),
        'created_at': data.created_at,
        'body': data.body,
        'count_symbols': data.body.length
      }})
    }
  }
})

describe('WritePage.vue', () => {
  let wrp

  beforeEach(() => {
    wrp = mount(WritePage)
  })

  it('show warning on empty note', (done) => {
    wrp.find('form').trigger('submit')

    let msg = wrp.find('div.message>span').text()
    expect(msg).toEqual('The note cannot be empty')

    done()
  })

  it('send note', (done) => {
    wrp.find('textarea').element.value = 'My super note'
    wrp.find('textarea').trigger('input')

    wrp.find('form').trigger('submit')

    wrp.vm.$nextTick(() => {
      let msg = wrp.find('div.message>span').text()
      expect(msg).toEqual('Written 13 symbols')

      done()
    })
  })
})
