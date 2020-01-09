var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        image: './assets/vmSocks-green-onWhite.jpg',
        link: 'https://vuejs.org/',
        inventory: 5,
        onSale: true,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        variants: [
            {
                variantId: 2234,
                variantColor: "green"
            },
            {
                variantId: 2235,
                variantColor: "blue"
            }
        ],
        sizes: ["small", "medium", "large"],
        cart: 0
    },
    methods: {
        addToCart: function (event){
            this.cart++;
        }
    }
})