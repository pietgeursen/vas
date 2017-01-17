const test = require('tape')
const values = require('object-values')

const { Service/*, Client*/, combine, pull } = require('./')

test('vas exports Server, Client, combine and pull functions', function (t) {
  t.equal(typeof Service, 'function', 'Service is a function')
  // t.equal(typeof Client, 'function', 'Client is a function')
  t.equal(typeof combine, 'function', 'combine is a function')
  t.equal(typeof pull, 'function', 'pull is a function')
  t.end()
})

test('hello world example works', function (t) {
  t.plan(4)

  const rawData = {
    1: 'human',
    2: 'computer',
    3: 'JavaScript'
  }

  const dataModule = {
    gives: 'data',
    create: () => () => rawData
  }

  const things = Service({
    name: 'things',
    needs: {
      data: 'first'
    },
    manifest: {
      all: 'source',
      get: 'async'
    },
    create: function (api) {
      const data = api.data()

      return {
        methods: { all, get }
      }

      function all () {
        const things = values(data)
        return pull.values(things)
      }

      function get (id, cb) {
        cb(null, data[id])
      }
    }
  })

  const api = combine({ things, dataModule })

  api.things.get(1, (err, value) => {
    t.error(err)
    t.equal(value, rawData[1])
  })

  pull(
    api.things.all(),
    pull.collect((err, arr) => {
      t.error(err)
      t.equal(arr.length, 3)
    })
  )
})