export default {
  data() {
    return {
      brandtypeList: [
        {
          value: 'famous',
          label: '著名商标'
        },
        {
          value: 'nofamouspersonal',
          label: '非个人著名商标'
        },
        {
          value: 'nofamouscompany',
          label: '非著名公司商标'
        }
      ],
      brandauthtypeList: [
        {
          value: 'directauth',
          label: '直接授权'
        },
        {
          value: 'indirectauth',
          label: '转授权'
        }
      ],
      brandaddrList: [
        {
          value: 'internal',
          label: '国内客户'
        },
        {
          value: 'external',
          label: '国外客户'
        }
      ],
      brandaddr: '',
      brandtype: '',
      brandauthtype: ''
    };
  },
  computed: {
    dowUrl: function() {
      let str = '';
      let brandtype = this.brandtype;
      let brandauthtype = this.brandauthtype;
      let baseUrl = 'http://alifile.xiaocaiyin.com/';
      if (brandtype == 'famous' && brandauthtype == 'directauth') {
        str = baseUrl + `qcxyztTest/aptitude大标-直接授权委托书 .docx`;
      } else if (brandtype == 'nofamouspersonal' && brandauthtype == 'indirectauth') {
        str = baseUrl + `qcxyztTest/aptitude个人客户印刷委托书.docx`;
      } else if (brandtype == 'nofamouscompany' && brandauthtype == 'directauth') {
        str = baseUrl + `qcxyztTest/aptitude公司商标授权书.docx`;
      } else if (brandtype == 'nofamouscompany' && brandauthtype == 'indirectauth') {
        str = baseUrl + `qcxyztTest/aptitude公司客户印刷委托书 .docx`;
      } else if (brandtype == 'famous' && brandauthtype == 'indirectauth') {
        str = baseUrl + `qcxyztTest/aptitude大标--转授权委托书 .docx`;
      } else if (brandtype == 'nofamouspersonal' && brandauthtype == 'directauth') {
        str = baseUrl + `qcxyztTest/aptitude个人商标授权书.docx`;
      }
      return str;
    },
    tipsStr() {
      let str = '';
      /** 商标类型 */
      let brandtype = this.brandtype;
      /**商标授权类型 */
      let brandauthtype = this.brandauthtype;
      /** 商标注册地 */
      let brandaddr = this.brandaddr;
      if (brandaddr == 'internal') {
        // 国内
        if (brandtype == 'famous') {
          //著名商标
          if (brandauthtype == 'indirectauth') {
            // 转授权
            str = `商标注册证电子版+授权书电子版（注册人授权给客户）+客户营业执照电子版/身份证电子版+转授权书电子版（授权给傲彩公司，可用现有模板）`;
          } else if (brandauthtype == 'directauth') {
            // 直接授权
            str = `商标注册证电子版+营业执照电子版+授权书电子版（注册人授权给傲彩，可用现有模板）`;
          }
        } else if (brandtype == 'nofamouspersonal') {
          //非个人著名商标
          if (brandauthtype == 'indirectauth') {
            // 转授权
            str = `个人身份证电子版+个人委托书电子版`;
          } else if (brandauthtype == 'directauth') {
            // 直接授权
            str = `个人身份证电子版+商标注册证电子版`;
          }
        } else if (brandtype == 'nofamouscompany') {
          if (brandauthtype == 'indirectauth') {
            str = `客户营业执照电子版+客户公司委托书电子版`;
          } else if (brandauthtype == 'directauth') {
            str = `商标注册证电子版+授权书电子版（可用现有模板）`;
          }
        }
      } else if (brandaddr == 'external') {
        // 国外
        if (brandtype == 'famous') {
          //著名商标
          if (brandauthtype == 'indirectauth') {
            // 转授权
            str = `商标注册证电子版+授权书电子版（注册人授权给客户）+客户的营业执照电子版/身份证电子版+转授权书电子版（客户授权给傲彩公司，可用对方模板）`;
          } else if (brandauthtype == 'directauth') {
            // 直接授权
            str = `商标注册证电子版+授权书电子版（注册人授权给傲彩，可用对方模板）+客户营业执照电子版`;
          }
        } else if (brandtype == 'nofamouspersonal') {
          //非个人著名商标
          if (brandauthtype == 'indirectauth') {
            // 转授权
            str = `个人身份证电子版+个人委托书电子版`;
          } else if (brandauthtype == 'directauth') {
            // 直接授权
            str = `商标注册证电子版+个人签字授权书电子版`;
          }
        } else if (brandtype == 'nofamouscompany') {
          if (brandauthtype == 'indirectauth') {
            str = `客户公司营业执照电子版+客户公司委托书电子版`;
          } else if (brandauthtype == 'directauth') {
            str = `商标注册证电子版+公司授权书电子版（可用对方模板）`;
          }
        }
      }
      console.log('str', str);
      return str;
    }
  }
};
