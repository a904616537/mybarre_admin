import Login    from './views/Login.vue'
import NotFound from './views/404.vue'
import Home     from './views/Home.vue'
import Main     from './views/Main.vue'
import Table    from './views/nav1/Table.vue'
import Form     from './views/nav1/Form.vue'
import Product  from './views/nav1/product.vue'
import Video    from './views/nav1/video.vue'
import Order    from './views/nav1/order.vue'
import Studio   from './views/nav1/studio.vue'
import Picture  from './views/nav1/picture.vue'
import Courses  from './views/nav1/courses.vue'
import Page4    from './views/nav2/Page4.vue'
import Page5    from './views/nav2/Page5.vue'
import Page6    from './views/nav3/Page6.vue'
import echarts  from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: 'User',
        iconCls: 'fa fa-address-card',//图标样式class
        leaf: true,
        children: [
            // { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/', component: Table, name: 'Users' }
        ]
    },{
        path      : '/',
        component : Home,
        name      : 'Choreographies',
        iconCls   : 'fa  fa-calendar',
        leaf      : true,
        children: [
            { path: '/courses', component: Courses, name: 'Choreographies' },
        ]
    },{
        path      : '/',
        component : Home,
        name      : 'Video',
        iconCls   : 'fa fa-video-camera',
        leaf      : true,
        children: [
            { path: '/video', component: Video, name: 'Videos' },
        ]
    },{
        path      : '/',
        component : Home,
        name      : 'Picture',
        iconCls   : 'fa fa-photo',
        leaf      : true,
        children: [
            { path: '/picture', component: Picture, name: 'Pictures' },
        ]
    },{
        path      : '/',
        component : Home,
        name      : 'Product',
        iconCls   : 'fa fa-fighter-jet',
        leaf      : true,
        children: [
            { path: '/product', component: Product, name: 'Products' },
        ]
    },{
        path      : '/',
        component : Home,
        name      : 'Order',
        iconCls   : 'fa fa-bars',
        leaf      : true,
        children: [
            { path: '/order', component: Order, name: 'Order' },
        ]
    },{
        path      : '/',
        component : Home,
        name      : 'Studio',
        iconCls   : 'fa fa-bars',
        leaf      : true,
        children: [
            { path: '/studio', component: Studio, name: 'Studio' },
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/page6', component: Page6, name: '导航三' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;