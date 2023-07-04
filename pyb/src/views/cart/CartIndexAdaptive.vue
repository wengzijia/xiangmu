<template>
  <div>
    <div class="catbj">
      <!--content start-->
      <div class="container clear">
        <!--主要内容-->

        <div class="catBox">
          <div class="ShopCarTile">
            <span style="cursor: pointer;font-size:14px;color:#666;"><font style="color: #d0111b;">盒型适配操作</font>：点击添加适配 删除适配组可释放产品重新适配</span>
          </div>
          <table class="ShopCartTable">
            <thead>
              <tr>
                <th width="28%" class="selectLeft">
                  <label class="el-checkbox curr">
                    <span class="el-checkbox__input"> <input type="checkbox" id="selectAll" value="" @click="allChecked(allCheckedId)" :checked="allCheckedId == -2 ? 'checked' : ''" />&nbsp; </span>
                    <span class="el-checkbox__label">全选</span>
                  </label>
                  <span class="batch-delete" style="margin-left: 30px;color: red;cursor: pointer;" @click="deleteAll(-1)">批量删除</span>
                  <span class="selectLeftGoods">商品名称</span>
                </th>
                <th width="24%" class="leftxt">规格</th>
                <th>数量</th>

                <th>小计</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vo, index) in cartList" :key="index" style="border: 1px dotted #e9e9e9;">
                <td class="selectLeft">
                  <label class="el-checkbox">
                    <span class="el-checkbox__input">
                      <input type="checkbox" name="cart_id" @click="allChecked(index)" :checked="vo.ischeck == 0 ? '' : 'checked'" />
                    </span>
                  </label>
                  <span class="inline"><img class="goodImg" :src="vo.goodsCoverPath"/></span>
                  <span class="inline goodsName" style="width: 44%;">
                    <p class="inline" style="font-weight: 400">{{ vo.goodsName }}</p>
                    <template v-if="vo.isAdaptive">
                      <br />
                      <button style="background-color:inherit;" type="button" class="layui-btn layui-btn-primary layui-btn-xs add_adaptive" @click="addAdaptive(vo.id, 1)">设为主体</button>
                      <br />
                      <br />
                      <button style="background-color:inherit;" type="button" class="layui-btn layui-btn-primary layui-btn-xs add_adaptive" @click="addAdaptive(vo.id, 2)">设为次体</button>
                    </template>
                  </span>
                </td>
                <td class="danPrice gattr{$vo.id}">{{ vo.goodsAttr }}</td>
                <td @click="updateNums(index)">
                  <!-- 精装盒-->
                  <el-input-number v-if="vo.goodsId == 951" v-model="vo.num" :min="20" :step="20" :step-strictly="true" size="mini"></el-input-number>
                  <el-input-number v-else-if="vo.num > 1000" v-model="vo.num" :min="100" :step="100" :step-strictly="true" size="mini"></el-input-number>
                  <el-input-number v-else v-model="vo.num" :min="100" :step="50" :step-strictly="true" size="mini"></el-input-number>
                </td>

                <td>
                  <p class="totalPrice price{$vo.id}">￥{{ vo.goodsTotal }}</p>
                </td>
                <td class="gongneng">
                  <p class="deletegoods" @click="deleteAll(vo.id)"><el-button plain type="button" size="mini" class="layui-btn layui-btn-primary layui-btn-sm">删 除</el-button></p>
                  <br />
                </td>
              </tr>
            </tbody>
          </table>
          <table class="ShopCartTable" style="margin-top:20px;" v-for="(gplist, index) in adaptiveMap" :key="index">
            <thead>
              <tr class="tille">
                <td colspan="5" style="text-align: left;">
                  <input type="checkbox" name="cart_id" :checked="adaptiveMapIs[index]" @click="adaptiveCheck(index)" />
                  适配编码: <span>{{ index }}</span>
                </td>
                <td>
                  <el-button size="small" plain @click="delAdaptive(index)">删除适配</el-button>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(gro, indexs) in gplist" :key="indexs" style="border: 1px dotted #e9e9e9;">
                <td width="28%" class="selectLeft">
                  <label class="el-checkbox">
                    <span class="el-checkbox__input" style="margin-left: 13px">
                      <!--                      <input type="checkbox" name="cart_id" id="cart_id{$gro.id}" value="{$gro.id}" data-val="{$gro.goods_total}" checked />-->
                    </span>
                  </label>
                  <span class="inline" style="position:relative;">
                    <img class="goodImg" :src="gro.goodsCoverPath" />
                    <span :class="gro.sortAdaptive == 1 ? 'subAbs' : 'subAbs curr'" style="display:block;">{{ gro.sortAdaptive == 1 ? '主' : '次' }}</span>
                  </span>
                  <span class="inline goodsName" style="width:42%;">
                    <p class="inline" style="font-weight: 400">{{ gro.goodsName }}</p>
                    <br />
                    <span class="layui-badge layui-bg-cyan" style="background-color: #FFB800 !important;padding: 1px 3px;border-radius: 3px;color: #fff;">已适配</span>
                    <!-- <span class="layui-badge layui-bg-blue">{if $gro.sort_adaptive eq 1}主{else}次{/if}</span> -->
                  </span>
                </td>
                <td width="24%" class="danPrice gattr{$gro.id}">{{ gro.goodsAttr }}</td>
                <td class="numberTd" @click="updateNums(index, 1, indexs)">
                  <el-input-number v-model="gro.num" :min="100" :step="50" :step-strictly="true" size="mini"></el-input-number>
                </td>
                <td class="fnumTd">
                  <!--                <el-input-number v-model="gro.num" :min="1" size="mini"></el-input-number>-->
                  <!--                <i class="deleteBtn " data-key="1">-</i>-->
                  <!--                <input type="text" class="numInput" placeholder="1" value="{$gro.fnumber|default='1'}" disabled />-->
                  <!--                <i class="addBtn " data-key="2">+</i>-->
                </td>
                <td>
                  <p class="totalPrice price{$gro.id}">￥{{ gro.goodsTotal }}</p>
                </td>
                <td class="gongneng">
                  <!--                <p class="deletegoods" data-id="{$gro.id}"><button type="button" class="layui-btn layui-btn-primary layui-btn-sm">删 除</button></p>-->
                </td>
              </tr>
              <tr style="border: 1px dotted #e9e9e9;">
                <td width="28%"></td>
                <td width="24%" class="danPrice"><p>适配新增工艺:无</p></td>
                <td class="numberTd"></td>
                <td class="fnumTd"></td>
                <td><p class="totalPrice price{$gro.id}">￥0.00</p></td>
                <td class="gongneng"></td>
              </tr>
              <tr style="background-color:#f7f7f7;">
                <td colspan="6" style="text-align: left;">
                  <template v-if="gplist[0].proofAdaptiveAddress">
                    适配打样收货地址：{{ gplist[0].proofAdaptiveAddress.city }}-{{ gplist[0].proofAdaptiveAddress.address }} 联系人: {{ gplist[0].proofAdaptiveAddress.contacts }} 联系电话: {{ gplist[0].proofAdaptiveAddress.mobile }}
                    <el-button size="mini" @click="showDetail(index, 1)">
                      修改
                    </el-button>
                    <el-button plain size="mini" @click="deleteByAdaptive(index)">删除</el-button>
                  </template>
                  <template v-else> 适配打样收货地址：默认大货 <el-button plain size="mini" @click="showDetail(index)">添加打样收货地址</el-button> </template>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="row tablefooter">
            <a href="" class="removeMuch">继续购物 <i>|</i></a>
            <span class="servicenum"
              >已选择<span class="goodsNum">{{ checkedCount }}</span
              >件商品
            </span>
            <span class="totalclassCutting"
              >总价：(不含运费)<span class="totalMoneyClass">￥{{ total }}</span>
            </span>
            <span @click="ToCheck" class="SettlementBtn">去结算</span>
          </div>
        </div>
      </div>
      <!--content-->
    </div>
    <el-dialog title="添加适配" :visible.sync="dialogTableVisible" center="center" width="850px">
      <div style="max-height: 600px;">
        <el-table border :data="lordData">
          <el-table-column width="55"></el-table-column>
          <el-table-column property="goodsName" width="170" :label="elTableColumn1"></el-table-column>
          <el-table-column property="goodsAttr" width="550"></el-table-column>
        </el-table>
        <br />
        <el-table border :data="boutData" @selection-change="handleSelectionChange" max-height="310px">
          <el-table-column type="selection" width="55" colspan="3"> </el-table-column>
          <el-table-column property="goodsName" width="170" :label="elTableColumn2"></el-table-column>
          <el-table-column property="goodsAttr" width="550"></el-table-column>
        </el-table>
        <el-row style="text-align: center;margin-top: 15px">
          <el-button type="danger" @click="addButtonSubmit" :disabled="addButtonType" round>立即提交</el-button>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" title="适配打样收货地址" width="700px" @close="closeForm('form')">
      <div style="padding: 0px 20px;">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="收货人" prop="consigneeName">
            <el-input v-model="form.consigneeName"></el-input>
            <label style="color: #f00; font-size: 12px;">* 请填写实名，国家规定收件人实名制，否则后果自负</label>
          </el-form-item>
          <el-form-item label="省市区" prop="countyId">
            <el-select v-model="form.provinceId" placeholder="请选择" style="width:180px;margin-right:10px;" @change="selectCity($event, 'province')">
              <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
            </el-select>
            <el-select v-model="form.cityId" placeholder="请选择" style="width:170px;margin-right:10px;" @change="selectCity($event, 'city')">
              <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="form.provinceId + '_' + index"> </el-option>
            </el-select>
            <el-select v-model="form.countyId" placeholder="请选择" style="width:170px" @change="selectCity($event, 'county')">
              <el-option v-for="(item, index) in countyList" :key="index" :label="item" :value="form.cityId + '_' + index"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="handlerSubmit">立即提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { adaptiveList, updateCheck, update, del, addAdaptiveList, addAdaptive, delAdaptive, saveOrUpdate, deleteByAdaptive } from '@/api/cart/cartApi';
import { getProvince, getCity, getAreaId, getAreaName } from '@/utils/city';
import store from '@/store';
export default {
  data() {
    // 手机号验证
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      }
    };
    return {
      lordData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      boutData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      dialogTableVisible: false,
      cartList: [],
      adaptiveMap: [],
      checkedCount: 0,
      collectCount: 0,
      total: 0,
      allCheckedId: -1,
      makeupCount: -1,
      pinCount: 0,
      multipleSelection: [],
      elTableColumn1: '盒型主体(已选中)',
      elTableColumn2: '待选盒型次体',
      addButtonType: true,
      adaptiveType: 1,
      adaptiveId: 0,
      dialogVisible: false,
      form: { province: '', city: '', county: '', provinceId: '', cityId: '', countyId: '', mobile: '' },
      rules: {
        consigneeName: { required: true, message: '请输入收货人', trigger: 'blur' },
        address: { required: true, message: '请输入地址', trigger: 'blur' },
        mobile: { validator: validatePhone, message: '请输入正确的手机号', trigger: 'blur' },
        countyId: { required: true, message: '请选择省市区', trigger: 'change' }
      },
      provinceList: [],
      cityList: [],
      countyList: [],
      saveAdaptiveId: 0,
      adaptiveChecked: 'checked',
      adaptiveMapIs: []
    };
  },
  methods: {
    //删除适配
    delAdaptive(index) {
      this.$confirm('是否要删除此适配', '适配删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = {
          data: index,
          language: 'zh-cn'
        };
        delAdaptive(data)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });

              this.listCart();
            } else {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
              return false;
            }
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
            console.log(err);
            return false;
          });
      });
    },
    //提交适配
    addButtonSubmit() {
      var multipleSelection = this.multipleSelection;
      if (multipleSelection.length < 1) {
        this.$message({
          type: 'error',
          message: '请先勾选在提交!'
        });
        return false;
      }
      var list = [];
      for (let key in multipleSelection) {
        if (multipleSelection[key].id != this.adaptiveId) {
          list.push(multipleSelection[key].id);
        }
      }
      var primaryIds = this.adaptiveType == 1 ? [this.adaptiveId] : list;
      var secondIds = this.adaptiveType == 1 ? list : [this.adaptiveId];

      var data = {
        language: 'zh-cn',
        primaryIds: [],
        secondIds: []
      };
      data.primaryIds = JSON.parse(JSON.stringify(primaryIds));
      data.secondIds = JSON.parse(JSON.stringify(secondIds));
      list.push(this.adaptiveId);
      var updateCheckData = {
        list: list,
        isCheck: true,
        isCheckAll: false,
        language: 'zh-cn'
      };
      //选中
      updateCheck(updateCheckData)
        .then(res => {})
        .catch(err => {});
      //适配
      addAdaptive(data)
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '适配成功!'
            });
            this.dialogTableVisible = false;
            this.listCart();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
            return false;
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '提交失败!'
          });
          console.log(err);
          return false;
        });
    },
    //点击适配
    addAdaptive(index, type) {
      console.log(index);
      this.elTableColumn1 = '盒型主体(已选中)';
      this.elTableColumn2 = '待选盒型次体';
      this.adaptiveType = type;
      this.adaptiveId = index;
      if (!index) {
        this.$message({
          type: 'error',
          message: '未获取到盒型，请刷新重试!'
        });
        return false;
      }
      if (type == 2) {
        this.elTableColumn1 = '盒型次体(已选中)';
        this.elTableColumn2 = '待选盒型主体';
      }
      addAdaptiveList()
        .then(res => {
          if (res.success) {
            var lordData = [];
            var boutData = [];
            console.log(res);
            var data = res.data;
            if (data.length < 2) {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
              return false;
            }
            for (let key in data) {
              if (data[key].id == index) {
                lordData.push(data[key]);
              } else {
                boutData.push(data[key]);
              }
            }
            this.lordData = lordData;
            this.boutData = boutData;
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
            return false;
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '提交失败!'
          });
          console.log(err);
          return false;
        });
      this.dialogTableVisible = true;
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      this.addButtonType = true;
      console.log('this.multipleSelection', this.multipleSelection);
      if (this.multipleSelection.length > 0) {
        this.addButtonType = false;
      }
    },
    async listCart() {
      await adaptiveList()
        .then(res => {
          if (res.success) {
            console.log(1, res);
            this.$set(this, 'cartList', res.data.list);
            this.$set(this, 'adaptiveMap', res.data.adaptiveMap);
            this.checkedCount = res.data.count;
            this.total = res.data.total;
            var adaptiveMap = res.data.adaptiveMap;
            for (let key in adaptiveMap) {
              if (adaptiveMap[key][0].ischeck == 1) {
                this.adaptiveMapIs[key] = 'checked';
              } else {
                this.adaptiveMapIs[key] = '';
              }
            }
            //获取购物车数量
            store.dispatch('CartCount').then(() => {});
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
          console.log(res);
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '获取数据失败!'
          });
          console.log(err);
        });
    },
    //进入页面默认选中所有商品
    async defaultSelected() {
      var data = {
        list: [0],
        isCheck: true,
        isCheckAll: true,
        language: 'zh-cn'
      };
      await updateCheck(data)
        .then(res => {
          if (res.success) {
            this.listCart();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
          console.log(res);
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '提交失败!'
          });
          console.log(err);
        });
    },
    //修改数量 款数
    updateNums(index, type, indexs) {
      var data = {};
      if (type) {
        data = {
          id: this.adaptiveMap[index][indexs].id,
          num: this.adaptiveMap[index][indexs].num
        };
      } else {
        data = {
          id: this.cartList[index].id,
          num: this.cartList[index].num
        };
      }

      update(data)
        .then(res => {
          if (res.success) {
            if (type) {
              this.adaptiveMap[index][indexs].goodsTotal = res.data;
            } else {
              this.cartList[index].goodsTotal = res.data;
            }

            var total = 0;
            for (let key in this.cartList) {
              if (this.cartList[key].ischeck == 1) {
                total += this.cartList[key].goodsTotal;
              }
            }
            var adaptiveMap = this.adaptiveMap;
            for (let key in adaptiveMap) {
              for (let keys in adaptiveMap[key]) {
                if (adaptiveMap[key][keys].ischeck == 1) {
                  total += adaptiveMap[key][keys].goodsTotal;
                }
              }
            }
            this.total = total;
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
          console.log(res);
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '提交失败!'
          });
          console.log(err);
        });
    },
    //全选
    allChecked(index) {
      var data = {};
      if (index < 0) {
        var isCheck = true;
        var ischeck = 1;
        var checked = 'checked';
        if (this.allCheckedId == -1) {
          this.allCheckedId = -2;
          this.adaptiveChecked = 'checked';
        } else {
          this.allCheckedId = -1;
          this.adaptiveChecked = '';
          isCheck = false;
          ischeck = 0;
          checked = '';
        }
        if (this.cartList.length <= 0 && Object.keys(this.adaptiveMap).length <= 0) {
          return false;
        }
        var adaptiveMap = this.adaptiveMap;
        for (let key in adaptiveMap) {
          this.adaptiveMapIs[key] = checked;
        }
        for (let key in this.cartList) {
          this.cartList[key].ischeck = ischeck;
        }
        data = {
          list: [0],
          isCheck: isCheck,
          isCheckAll: true,
          language: 'zh-cn'
        };
      } else {
        data = {
          list: [this.cartList[index].id],
          isCheck: this.cartList[index].ischeck == 0 ? true : false,
          isCheckAll: false,
          language: 'zh-cn'
        };
      }
      // return false;
      updateCheck(data)
        .then(res => {
          if (res.success) {
            this.listCart();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
          console.log(res);
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '提交失败!'
          });
          console.log(err);
        });
    },
    //删除
    deleteAll(index) {
      var list = [];
      var data = {
        list: [index],
        language: 'zh-cn'
      };
      var message = '确定要删除此商品吗?';
      var title = '商品删除';
      if (index == -1) {
        var cartList = this.cartList;
        for (var i = 0; i < cartList.length; i++) {
          if (cartList[i].ischeck > 0) {
            list.push(cartList[i].id);
          }
        }
        if (list.length == 0) {
          this.$message({
            type: 'error',
            message: '请勾选商品，再操作!'
          });
          return false;
        }
        data = {
          list: list,
          language: 'zh-cn'
        };
        message = '确定要删除已选中的这' + list.length + '商品吗?';
        title = '商品批量删除';
      }
      this.$confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(data)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.listCart();
            } else {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
            }
            console.log(res);
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
            console.log(err);
          });
      });
    },
    //地址
    selectCity(val, type) {
      if (type === 'province') {
        this.$set(this.form, 'cityId', '');
        this.$set(this.form, 'countyId', '');
        this.$set(this, 'cityList', getCity(this.form.provinceId));
        this.$set(this, 'countyList', []);
      } else if (type === 'city') {
        this.$set(this.form, 'countyId', '');
        this.$set(this, 'countyList', getCity(this.form.cityId));
      }
    },

    showDetail(index, id) {
      if (id) {
        //编辑
        var adaptiveMap = this.adaptiveMap[index][0]['proofAdaptiveAddress'];

        var city = new Array(); //定义一数组
        city = adaptiveMap['city'].split('-'); //字符分割
        var data = {
          address: adaptiveMap['address'],
          city: city[1],
          consigneeName: adaptiveMap['contacts'],
          county: city[2],
          mobile: adaptiveMap['mobile'],
          province: city[0]
        };

        this.$set(this, 'form', data);
        if (this.form.province) {
          this.$set(this.form, 'provinceId', getAreaId('province', this.form.province));
        }
        if (this.form.city) {
          this.$set(this.form, 'cityId', getAreaId('city', this.form.city, this.form.provinceId));
          this.cityList = getCity(this.form.provinceId);
        }
        if (this.form.county) {
          this.$set(this.form, 'countyId', getAreaId('county', this.form.county, this.form.cityId));
          this.countyList = getCity(this.form.cityId);
        }
      } else {
        this.$set(this, 'form', {});
      }
      this.saveAdaptiveId = index;
      this.dialogVisible = true;
    },
    closeForm(formName) {
      this.$refs[formName].resetFields();
    },
    handlerSubmit() {
      const formName = 'form';
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.form.provinceId) {
            this.$message({ type: 'error', message: '请选择省份' });
            return false;
          } else if (!this.form.cityId) {
            this.$message({ type: 'error', message: '请选择市' });
            return false;
          } else if (!this.form.countyId) {
            this.$message({ type: 'error', message: '请选择地区' });
            return false;
          }
          this.form.province = getAreaName('province', this.form.provinceId);
          this.form.city = getAreaName('city', this.form.cityId);
          this.form.county = getAreaName('county', this.form.countyId);
          console.log(this.form);

          var data = {
            adaptive: this.saveAdaptiveId,
            address: this.form.address,
            city: this.form.province + '-' + this.form.city + '-' + this.form.county,
            contacts: this.form.consigneeName,
            mobile: this.form.mobile
          };
          console.log(data);

          saveOrUpdate({
            data: data,
            language: 'zh-cn'
          })
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
                this.listCart();
                this.dialogVisible = false;
              } else {
                this.$message({
                  type: 'error',
                  message: '提交失败!'
                });
              }
              console.log(res);
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
              console.log(err);
            });
        }
      });
    },
    //删除适配地址
    deleteByAdaptive(index) {
      this.$confirm('是否要删除适配打样收货地址？', '删除适配打样收货地址', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data = {
          data: index,
          language: 'zh-cn'
        };
        deleteByAdaptive(data)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.listCart();
            } else {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
            }
            console.log(res);
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
            console.log(err);
          });
      });
    },
    //选中适配商品
    adaptiveCheck(index) {
      var adaptiveMap = this.adaptiveMap;
      var list = [];
      var isCheck = true;
      this.adaptiveMapIs[index] = 'checked';
      if (adaptiveMap[index][0].ischeck == 1) {
        isCheck = false;
        this.adaptiveMapIs[index] = '';
      }
      for (let key in adaptiveMap[index]) {
        list.push(adaptiveMap[index][key].id);
      }

      var data = {
        list: list,
        isCheck: isCheck,
        isCheckAll: false,
        language: 'zh-cn'
      };
      updateCheck(data)
        .then(res => {
          if (res.success) {
            this.listCart();
          } else {
            this.$message({
              type: 'error',
              message: '提交失败!'
            });
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '提交失败!'
          });
          console.log(err);
        });
    },
    //去结算
    ToCheck() {
      var list = [];
      var cartList = this.cartList;
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].ischeck > 0) {
          list.push(cartList[i].id);
        }
      }
      var adaptiveMap = this.adaptiveMap;
      for (let key in adaptiveMap) {
        for (let keys in adaptiveMap[key]) {
          if (adaptiveMap[key][keys].ischeck > 0) {
            list.push(adaptiveMap[key][keys].id);
          }
        }
      }
      if (list.length == 0) {
        this.$message({
          type: 'error',
          message: '请勾选商品，再操作!'
        });
        return false;
      }
      this.$router.push({ path: '/cart/checkorder' });
    }
  },

  async created() {
    await this.listCart();
    // await this.defaultSelected();
    this.provinceList = getProvince();
  }
};
</script>
<style scoped src="../../static/index/user/css/wbb1125showye.css"></style>
<style scoped src="../../static/index/user/css/all.css" />
<!--<style scoped src="../../static/index/css/base.css" />-->
<style scoped src="../../static/index/css/common.css" />
<!--<style scoped src="../../static/assets/layui/css/layui.css" />-->
<style scoped src="../../static/index/css/shopping_adaptive.css" />
<style scoped src="../../static/index/css/new/cart.css" />

<style>
body {
  font-family: '微软雅黑', HELVETICA;
}
</style>
