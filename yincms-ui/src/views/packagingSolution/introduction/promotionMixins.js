import { pagePackScheme } from '@/api/zbz/packCategoryApi';
import { savePackCustomer, saveKeyword } from '@/api/home/homeApi';
import CustomerService from '@/components/footer/CustomerService2.vue';
import { setKeywords, setDocumentTitle } from '@/utils/domUtil';
export default {
  components: { CustomerService },
  data() {
    return {
      packList: [
        {
          name: '端午礼品包装',
          moreId: '85',
          isHideHeader: true,
          list: [{ name: '粽子包装', isActive: true, list: ['2020', '2025', '2012', '2013', '2024', '2011', '2021', '2022', '2023', '2026', '2016', '2017', '2009', '2010', '2014', '2015', '2030', '2027', '2029', '2028'] }]
        },
        {
          name: '热门礼品包装方案推荐',
          moreId: '147',
          isHideHeader: true,
          list: [
            { name: '促销礼品', isActive: true, list: ['2149', '2145', '2144', '2139', '2148', '2150', '2147', '2152', '2153', '2141', '2154', '2142'] },
            { name: '中秋礼品', isActive: false, list: ['2072', '2048', '2057', '2052', '2043', '2042', '2053', '2038', '2039', '2078', '2066', '2067'] },
            { name: '春节礼品', isActive: false, list: ['589', '588', '587', '736', '646', '697', '643', '642', '694', '635', '645', '636'] },
            { name: '商务礼品', isActive: false, list: ['731', '2185', '640', '2184', '729', '727', '2186', '698', '641', '728', '644', '2187'] },
            { name: '圣诞礼品', isActive: false, list: ['2098', '2094', '2096', '2158', '2099', '2104', '2101', '2102', '2157', '2103', '2100', '2095'] },
            { name: '庆典礼品', isActive: false, list: ['2108', '2120', '2119', '2161', '2164', '2166', '2162', '2160', '2167', '2106', '2165', '2107'] }
          ]
        }
      ],
      baseImgUrl: 'http://alifile.xiaocaiyin.com/',
      packScheme: {
        formId: 1540,
        cateId: 82,
        composeId: 0,
        planId: 1596,
        baseId: 3219,
        packId: 3220,
        styleId: 6,
        goodsTag: '15,6',
        schemeNo: 'CA516006',
        schemeName: '2.8英寸触屏MP4/MP3播放器_MP3/MP4_1台_1盒装_包装方案',
        packAttr: '避光,环保,便携',
        adapter: '',
        status: '0',
        mould: '',
        note: '',
        addtime: 1680748287,
        adminid: 22857,
        receiveTime: 1682324552,
        receiveUid: 22857,
        verifyTime: 1682324652,
        verifyStatus: 1,
        remarks: '',
        isShow: 1,
        mould3d: null,
        price: 3.31,
        saleCount: 0,
        sdCategoryId: '36,137',
        thumbnail: null,
        goodsImg: {
          firstThumbnail: 'uploads/file/VO202304/VO/skin_3020/6b74b88e256e7fcc5cacc5443ba8b23a.jpg',
          secondThumbnail: 'uploads/file/VO202304/VO/skin_3020/21164493d4a6ddf15e07ebaa1d1b5753.jpg',
          watermark: 'uploads/file/VO202304/VO/skin_3020/42d763a2ed431b90ec3a1f93f48dc83d.jpg'
        },
        description: null,
        isHot: '0',
        attribute: null,
        packForm: null,
        designList: null,
        isCustomized: 1,
        isCustom: 0,
        hotSort: 0,
        id: 2777,
        categoryId: '100,3'
      },
      saveParams: {
        cateName: '',
        customerName: '',
        mobile: '',
        webCateId: 0,
        client: 'PC'
      },
      searchVal: '',
      carouselList: [
        [
          {
            name: '张先生',
            mobile: '138****4521',
            time: '1'
          },
          {
            name: '刘先生',
            mobile: '189****2451',
            time: '1'
          }
        ],
        [
          {
            name: '张小姐',
            mobile: '188****1171',
            time: '4'
          },
          {
            name: '吴先生',
            mobile: '138****1452',
            time: '5'
          }
        ],
        [
          {
            name: '陈先生',
            mobile: '137****1552',
            time: '6'
          },
          {
            name: '曾小姐',
            mobile: '189****4151',
            time: '10'
          }
        ],
        [
          {
            name: '唐小姐',
            mobile: '130****8511',
            time: '1'
          },
          {
            name: '刘小姐',
            mobile: '180****4112',
            time: '2'
          }
        ],
        [
          {
            name: '陈先生',
            mobile: '130****9654',
            time: '3'
          },
          {
            name: '刘先生',
            mobile: '189****7810',
            time: '1'
          }
        ],
        [
          {
            name: '张先生',
            mobile: '130****7561',
            time: '2'
          },
          {
            name: '赵先生',
            mobile: '192****6520',
            time: '1'
          }
        ],
        [
          {
            name: '吴先生',
            mobile: '137****1352',
            time: '4'
          },
          {
            name: '陈小姐',
            mobile: '180****4874',
            time: '1'
          }
        ]
      ],
      packSchemeInfo: {},
      pagePackSchemeParams: {
        pageNumber: 1, //页数
        pageSize: 100 //页大小
        // categoryIds: '1'
      },
      pageKeywords: {
        title: '化妆品包装_免费设计打样_大货100起订 - 傲彩aocai.cn',
        keywords: '化妆品包装,面膜包装,面霜包装,唇膏包装,香水包装,护手霜包装,精油包装',
        description: '傲彩化妆品包装专题，为客户提供面膜、面霜、精华液等化妆品包装设计方案，免费设计打样，在线报价下单，做包装上傲彩。'
      }
    };
  },
  methods: {
    activeItem(item, index2) {
      let _this = this;
   
      let ids = [];

      item.list = item.list.map((e, index) => {
        if (index2 === index) {
          e.isActive = true;
          ids = e.list;
          _this.$report({
            actionId: e.actionId,
            channel: item.channel
          });
          if (!_this.packSchemeInfo[e.name]) _this.pagePackSchemeFun(e.list, e);
        } else {
          e.isActive = false;
        }
        return e;
      });
    },
    /**PC端搜索 */
    searchFun() {
      if (this.searchVal != '') {
        this.$report({
          actionId: 1,
          channel: 201000
        });
        window.open(`/packagingSolution/searchResults?schemeName=${this.searchVal}`);
        saveKeyword({ keyword: this.searchVal, client: 0 });
      }
    },
    /**PC端跳转详情页 */
    toPackageDetails(item) {
      window.open(`/packagingSolution/packageDetails?id=${item.id}`);
    },
    /** WAP端搜索 */
    wapSearchFun() {
      if (this.searchVal != '') {
        window.open(`/introduction/wap/pack-search?schemeName=${this.searchVal}`);
        saveKeyword({ keyword: this.searchVal, client: 1 });
      }
    },
    /** WAP端跳转详情页 */
    toWapPackageDetails(item) {
      window.open(`/introduction/wap/pack-plan?id=${item.id}`);
    },
    /** 保存手机号 */
    save(reportInfo) {
      // 校验中文姓名正则
      let reg = /^[\u4e00-\u9fa5]{2,4}$/;
      // 校验手机号正则
      let regPhone = /^1[3456789]\d{9}$/;
      if (!reg.test(this.saveParams.customerName)) {
        this.$message.error('请输入正确的姓名');
        return;
      }
      if (!regPhone.test(this.saveParams.mobile)) {
        this.$message.error('请输入正确的手机号');
        return;
      }
      if (reportInfo) {
        this.$report(reportInfo);
      }
      savePackCustomer(this.saveParams).then(res => {
        if (res.code == '000000') {
          this.$message.success('提交成功');
          this.saveParams.customerName = '';
          this.saveParams.mobile = '';
        } else {
          // this.$message.error(res.msg);
        }
      });
    },
    /** 回到顶部 */
    backtop() {
      this.$refs['backtopRef'].handleClick();
    },
    /** 把返回的包装方案信息转成前端 */
    setPackSchemeInfo(list, item) {
      let _this = this;
      list = list.map(e => {
        e.goodsImg = JSON.parse(e.goodsImg);
        return e;
      });
      let setInfoFun = function(item) {
        _this.$set(
          _this.packSchemeInfo,
          item.name,
          item.list.map(e => {
            return list.find(s => e == s.id);
          })
        );
      };
      if (item && item.name && !_this.packSchemeInfo[item.name]) {
        setInfoFun(item);
        return;
      }
      for (let index = 0; index < _this.packList.length; index++) {
        for (let i = 0; i < _this.packList[index].list.length; i++) {
          let item = _this.packList[index].list[i];
          if (item.isActive && !_this.packSchemeInfo[item.name]) {
            setInfoFun(item);
          }
        }
      }
    },
    /**获取包装方案信息 */
    pagePackSchemeFun(ids, name) {
      let _this = this;
      pagePackScheme({
        ..._this.pagePackSchemeParams,
        schemeIds: ids
      }).then(res => {
        _this.setPackSchemeInfo(res.data, name);
      });
    }
  },
  created() {
    let _this = this;
    let ids = [];
    _this.packList.forEach(e => {
      ids.push(...e.list.find(e => e.isActive).list);
    });
    _this.pagePackSchemeFun(ids);
    setKeywords(this.pageKeywords.keywords, this.pageKeywords.description);
    setDocumentTitle(this.pageKeywords.title);
  }
};
