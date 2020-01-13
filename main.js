var eventBus = new Vue()

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
                
                <info-tabs :shipping="shipping" :details="details"></info-tabs>
                
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
                <a :href="link"> Go to vue.js homepage</a>

                <button @click="addToCart"
                        :disabled="inStock<1"
                        :class="{ disabledButton: inStock<1}">Add to Cart</button>
                <button @click="removeFromCart">Remove from Cart</button>
                
                <product-tabs :reviews="reviews"></product-tabs>
       
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
            sizes: ["small", "medium", "large"],
            reviews: []

        }
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart: function () {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct: function (index) {
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
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        onSaleMessage() {
            return this.brand + ' ' + this.product + ' on sale';
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99;
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview =>{
            this.reviews.push(productReview);
        })
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
        
        <p v-if="errors.length">
            <b>Please correct the following error(s)</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        
        <p>
            Would you recommend this product?
        </p>
        <input v-model="recommend" name="recommend" type="radio" value="no"> No <br>
        <input v-model="recommend" name="recommend" type="radio" value="yes"> Yes <br>
        
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name">
        </p>
        
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        
        <p>
            <input type="submit" value="Submit">
        </p>
        
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            recommend: null
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
                this.errors = [];
            } else {
                if (!this.name) this.errors.push("Name required.");
                if (!this.review) this.errors.push("Review required.");
                if (!this.rating) this.errors.push("Rating required.");
                if (!this.recommend) this.errors.push("Recommendation required.");
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },

    template: `
        <div>
            <span class="tab"
                :class="{activeTab: selectedTab ===tab}"
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="selectedTab = tab">
                {{ tab }} </span>
                
            <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                    <p>{{review.name}}</p>
                    <p>Rating: {{review.rating}}</p>
                    <p>{{review.review}}</p>
                    <p>Recommendation: {{review.recommend}}</p>
                    </li>
                </ul>
            </div>
            <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

Vue.component('info-tabs', {
    props: {
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
      <div>
      
        <ul>
          <span class="tabs" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>
    
      </div>
    `,
    data() {
        return {
            tabs: ['Shipping', 'Details'],
            selectedTab: 'Shipping'
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
        updateCart(id) {
            this.cart.push(id);
        },
        removeProduct(id) {
            const index = this.cart.indexOf(id);
            if (index > -1) {
                this.cart.splice(index, 1);
            }
        }
    }
})
