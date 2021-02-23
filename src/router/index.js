import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
 return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/login',
      name: 'login',
      component: resolve=>require(["@/pages/login"],resolve)
    },
    {
      path: '/generalProList',
      name: 'generalProList',
      component: resolve=>require(["@/pages/generalProList"],resolve)
    },
    {
      path: '/register',
      name: 'register',
      component: resolve=>require(["@/pages/register"],resolve)
    },
    {
      path: '/total',
      name: 'total',
      component: resolve=>require(["@/pages/total"],resolve)
    },
    {
      path: '/insure/',
      name: 'insure',
      component: resolve=>require(["@/pages/insure"],resolve)
    },
    {
      path: '/order',
      name: 'order',
      redirect:'/order/allOrder',
      component: resolve=>require(["@/pages/order"],resolve),
      children:[
        {
          path: '/order/allOrder',
          name: 'allOrder',
          component: resolve=>require(["@/components/allOrder"],resolve)
        },
        {
          path: '/order/payOrder',
          name: 'payOrder',
          component: resolve=>require(["@/components/payOrder"],resolve)
        }
      ]
    },
    {
      path: '/finance',
      name: 'finance',
      redirect:'/finance/income',
      component: resolve=>require(["@/pages/finance"],resolve),
      children:[
        {
          path: '/finance/income',
          name: 'income',
          component: resolve=>require(["@/components/income"],resolve)
        },
        {
          path: '/finance/balance',
          name: 'balance',
          component: resolve=>require(["@/components/balance"],resolve)
        }
      ]
    },
    {
      path: '/childAccount',
      name: 'childAccount',
      component: resolve=>require(["@/pages/childAccount"],resolve)
    },
    {
      path: '/invoice',
      name: 'invoice',
      redirect:'/invoice/bill',
      component: resolve=>require(["@/pages/invoice"],resolve),
      children:[
        {
          path: '/invoice/bill',
          name: 'bill',
          component: resolve=>require(["@/components/bill"],resolve)
        },
        {
          path: '/invoice/history',
          name: 'history',
          component: resolve=>require(["@/components/history"],resolve)
        }
      ]
    },
    {
      path: '/notice',
      name: 'notice',
      component: resolve=>require(["@/pages/notice"],resolve)
    },
    {
      path: '/noticeDetail/:id',
      name: 'noticeDetail',
      component: resolve=>require(["@/pages/noticeDetail"],resolve)
    },
    {
      path: '/account',
      name: 'account',
      redirect:'/account/accountInfo',
      component: resolve=>require(["@/pages/account"],resolve),
      children:[
        {
          path: '/account/accountInfo',
          name: 'accountInfo',
          component: resolve=>require(["@/components/accountInfo"],resolve)
        },
        {
          path: '/account/accountSafe',
          name: 'accountSafe',
          component: resolve=>require(["@/components/accountSafe"],resolve)
        },
        {
          path: '/account/contact',
          name: 'contact',
          component: resolve=>require(["@/components/contact"],resolve)
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: resolve=>require(["@/pages/user"],resolve)
    },
    {
      path: '/goods',
      name: 'goods',
      redirect:'/goods/myGoods',
      component: resolve=>require(["@/pages/goods"],resolve),
      children:[
        {
          path: '/goods/myGoods',
          name: 'myGoods',
          component: resolve=>require(["@/components/myGoods"],resolve)
        },
        {
          path: '/goods/goodsList',
          name: 'goodsList',
          component: resolve=>require(["@/components/goodsList"],resolve)
        }
      ]
    },
    {
      path: '/channel',
      name: 'channel',
      redirect:'/channel/channelAccount',
      component: resolve=>require(["@/pages/channel"],resolve),
      children:[
        {
          path: '/channel/channelAccount',
          name: 'channelAccount',
          component: resolve=>require(["@/components/channelAccount"],resolve)
        },
        {
          path: '/channel/channelBill',
          name: 'channelBill',
          component: resolve=>require(["@/components/channelBill"],resolve)
        },
        {
          path: '/channel/channelBilldetail',
          name: 'channelBilldetail',
          component: resolve=>require(["@/components/channelBilldetail"],resolve)
        },
        {
          path: '/channel/channelApply',
          name: 'channelApply',
          component: resolve=>require(["@/components/channelApply"],resolve)
        },
        {
          path: '/channel/channelApply/proRate/:id',
          name: 'proRate',
          component: resolve=>require(["@/components/proRate"],resolve)
        },
        {
          path: '/channel/rate',
          name: 'rate',
          component: resolve=>require(["@/components/rate"],resolve)
        },
        {
          path: '/channel/channelAccount/bmRate/:id',
          name: 'bmRate',
          component: resolve=>require(["@/components/bmRate"],resolve)
        },
        {
          path: '/channel/rate/flRate/:id',
          name: 'flRate',
          component: resolve=>require(["@/components/flRate"],resolve)
        },
        {
          path: '/channel/rate/setRate/:id',
          name: 'setRate',
          component: resolve=>require(["@/components/setRate"],resolve)
        }
    ]
    },
    {
      path: '/invite',
      name: 'invite',
      component: resolve=>require(["@/pages/invite"],resolve)
    },
    {
      path: '/pay',
      name: 'pay',
      component: resolve=>require(["@/pages/pay"],resolve)
    },
    {
      path: '/payWx',
      name: 'payWx',
      component: resolve=>require(["@/pages/payWx"],resolve)
    },
    {
      path: '/provision/:id',
      name: 'provision',
      component: resolve=>require(["@/pages/provision"],resolve)
    },
    {
      path: '/orderDetail/:id',
      name: 'orderDetail',
      component: resolve=>require(["@/pages/orderDetail"],resolve)
    },
    {
      path: '/productList',
      name: 'productList',
      component: resolve=>require(["@/pages/productList"],resolve)
    },
    {
      path: '/generalProList',
      name: 'generalProList',
      component: resolve=>require(["@/pages/generalProList"],resolve)
    },
    {
      path: '/productDetail/:id',
      name: 'productDetail',
      component: resolve=>require(["@/pages/productDetail"],resolve)
    }
  ]
})
export default router;
