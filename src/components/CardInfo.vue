<template>
<div class="card">
    <div class="imgBx">
    <img src="/src/assets/plu-logo.jpg" />
    </div>
    <div class="content">
    <div class="details">
        <h2>Plu de Brignoles<br /><span>83023</span></h2>
        <div class="data">
        <h3>342<br /><span>Documents</span></h3>
        <h3>7<br /><span>Servitudes</span></h3>
        <h3>92<br /><span>Risques</span></h3>
        </div>
        <div class="actionBtn">
        <button>Visualiser</button>
        <button>Details</button>
        </div>
    </div>
    </div>
</div>
</template>

<script>
export default {

}
</script>

<style lang="scss">

.card{
    position: absolute;
    top: 20vh;
    right: 6vw;
    width: 350px;
    height: 190px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 35px 80px rgba(0,0,0,0.15);
    transition: 0.5s;
    z-index: 2;

    &:hover{
        height: 450px;

        .imgBx {
            width: 250px;
            height: 250px;
        }

        .content .details {
            transform: translateY(0px);
        }
    }

    .imgBx {
        position: absolute;
        left: 50%;
        top: -50px;
        transform: translateX(-50%);
        width: 150px;
        height: 150px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.35);
        overflow: hidden;
        transition: 0.5s;

        img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .content {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        overflow: hidden;

        .details {
            padding: 40px;
            text-align: center;
            width: 100%;
            transition: 0.5s;
            transform: translateY(150px);

            h2 {
                font-size: 1.25em;
                font-weight: 600;
                color: #555;
                line-height: 1.2em;

                span {
                    font-size: 0.75em;
                    font-weight: 500;
                    opacity: 0.5;
                }
            }

            .data {
                display: flex;
                justify-content: space-between;
                margin: 20px 0;

                h3 {
                    font-size: 1em;
                    color: #555;
                    line-height: 1.2em;
                    font-weight: 600;

                    span {
                        font-size: 0.85em;
                        font-weight: 400;
                        opacity: 0.5;
                    }
                }
            }

            .actionBtn {
                display: flex;
                justify-content: space-between;
                gap: 20px;

                button {
                    padding: 10px 30px;
                    border-radius: 5px;
                    border: none;
                    outline: none;
                    font-size: 1em;
                    font-weight: 500;
                    background: #ff5f95;
                    color: #fff;
                    cursor: pointer;

                    &:nth-child(2) {
                        border: 1px solid #999;
                        background: #fff;
                        color: #999;
                    }
                }
            }
        }
    }  
}
</style>