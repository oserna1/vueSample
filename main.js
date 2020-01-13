Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{detail}}</li>
        </ul>
    `
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="image" alt="sockImage">
            </div>
            <div class="product-info">
                <h1>{{title}}</h1>
                <p>{{product}} are like gloves for your feets </p>
                <p v-if="onSale">{{onSaleMessage}}</p>
                <product-details :details="details"></product-details>
                
                <div v-for="(variant, index) in variants"
                     :key="variant.variantId"
                     class="color-box "
                     :style="{ backgroundColor: variant.variantColor }"
                     @mouseover="updateProduct(index)">
                    <p> {{variant.variantQuantity}}</p>
                </div>

                <div v-for="size in sizes">
                    <p>{{size}}</p>
                </div>

                <p v-if="inStock > 10">In Stock</p>
                <p v-else-if="inStock<=10 && inStock > 0">Almost Sold Out!</p>
                <p v-else :class="{lineThrough: true}">Out of Stock</p>
                <p v-if="onSale">On Sale!</p>
                <p>Shipping {{ shipping }}</p>
                <a :href="link"> Go to vue.js homepage</a>

                <button @click="addToCart"
                        :disabled="inStock<1"
                        :class="{ disabledButton: inStock<1}">Add to Cart</button>
                <button @click="removeFromCart">Remove from Cart</button>
            </div>


        </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            link: 'https://vuejs.org/',
            onSale: true,
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 11
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 5
                }
            ],
            sizes: ["small", "medium", "large"]

        }
    },
    methods: {
        addToCart: function (){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
            this.variants[this.selectedVariant].variantQuantity--;
        },
        removeFromCart: function(){
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
            this.variants[this.selectedVariant].variantQuantity++;
        },
        updateProduct: function(index){
            this.selectedVariant = index;
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        onSaleMessage(){
            return this.brand + ' ' + this.product + ' on sale';
        },
        shipping(){
            if(this.premium){
                return "Free";
            }else{
                return 2.99;
            }
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id){
            this.cart.push(id);
        },
        removeProduct(id){
            const index = this.cart.indexOf(id);
            if (index > -1) {
                this.cart.splice(index,1);
            }
        }
    }
})
