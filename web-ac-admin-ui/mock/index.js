import JSON5 from 'json5'
import * as fs from 'fs'
import path from 'path'

function getJsonFile(filePath, key) {
    var json = fs.readFileSync(path.resolve(__dirname, filePath), 'utf-8')
    console.log('JSON5.parse(json)[key]', JSON5.parse(json)[key]);
    return JSON5.parse(json)[key]
}

export default [
  {
    url: "/mock/api/getUsers",
    method: "get",
    response: () => {
        return {
            code: 0,
            message: "ok",
            data: getJsonFile('./marketing.json5', 'couponList'),
        }
    }
  },
  {
    url: "/mock/api/createCoupon",
    method: "get",
    response: () => {
        return {
            code: 0,
            message: "ok",
            data: getJsonFile('./marketing.json5', 'createCoupon'),
        }
    }
  },
  {
    url: "/mock/api/quotaControl",
    method: "get",
    response: () => {
        return {
            code: 0,
            message: "ok",
            data: getJsonFile('./marketing.json5', 'quotaControl'),
        }
    }
  },
  {
    url:'/mock/api/configurationType',
    method: "get",
    response: () => {
        return {
            code: 0,
            message: "ok",
            data: getJsonFile('./marketing.json5', 'configurationType'),
        }
    }
  },
  {
    url:'/mock/api/useOverview',
    method: "get",
    response: () => {
        return {
            code: 0,
            message: "ok",
            data: getJsonFile('./marketing.json5', 'useOverview'),
        }
    }
  },
  {
    url:'/mock/api/distributionStatistics',
    method: "get",
    response: () => {
        return {
            code: 0,
            message: "ok",
            data: getJsonFile('./marketing.json5', 'distributionStatistics'),
        }
    }
  }
]
