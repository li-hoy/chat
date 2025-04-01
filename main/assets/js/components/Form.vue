<script>
export default ({
    data: function () {
        return {
            html: '',
        };
    },
    computed: {
        form: function () {
            return this.html;
        }
    },
    created: function () {
        this.load();
    },
    methods: {
        load: function () {
            fetch('/users/profile')
                .then((response) => {
                    return response.text()
                })
                .then((html) => {
                    this.html = html;
                })
                .catch(error => console.error(error));
        },
        vaildate: function () {

        },
        submit: function () {

        }
    }        
})
</script>

<template>
    <div class="form-wrapper" v-html="form"></div>
</template>
