# BC Moaner Reloaded

为Bondage Club制作的Moaner油猴甲苯。
原为[Moaner](https://github.com/kimei-nishimura/moaner)，但那个太难配置了，所以做了个油猴的代替版本。

## 配置参考


* hot/medium/light/low: 通过抚慰和玩具刺激触发，根据喜好和兴奋度触发不同等级
* orgasm: 在高潮时触发，忍住高潮不会触发
* pain: 在被拍打/掐捏/扇脸/电击时触发，同时会根据喜好和兴奋度触发hot/medium/light/low
* tickle: 在挠痒时触发，同时会根据喜好和兴奋度触发hot/medium/light/low
* 每个词条都是等概率的，可以填入空词条来减少触发概率，或者干脆不填词条来使它不触发

``` javascript
const MoanerValue = {
    "hot": ["n... Nyah♥", "Oooh", "mmmmmh!", "NYyaaA♥"],
    "medium": ["mm", "aaaah", "nyAh♥"],
    "light": ["nyah♥", "Aah!", "mh", "oh!♥", "mh♥"],
    "low": ["", "", "mh", "♥oh♥", "ah", "...♥"],
    "orgasm": ["Nya...Ny...NyaaAAaah!", "Mmmmh... MMmh... Hhhmmmm...", "Oooooh... Mmmmh... OooOOOOh!", "Mmmhnn... Nyhmm... Nyah!"],
    "pain": ["Aie!", "Aoouch!", "Aaaaie!", "Ouch", "Aow"],
    "tickle": ["Hahaha!", "Mmmmhahaha!", "Muhahah...", "Ha!Ha!"],
};
```