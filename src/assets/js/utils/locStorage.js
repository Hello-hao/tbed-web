import moment from "moment";

var storage = {
    /*key 保存键
     *value 保存内容 localSorage 不能保存 Object 对象 需要使用 stringify 进行转换
     * expired 失效时间 定义 单位 分钟
     */
    set(key, value, expired) {

        /*定义 source 临时 对象 临时存储 key value 赋值后 加入到 localStorage */
        let source = { key: key, value: value };

        /*now 获取当前时间 */
        const now = Date.now();
        /*1 分钟计算 (1000*60)  计算出总失效时间 (1000 * 60 * expired) now + 失效总分钟 算出最大存储时间*/
        if (expired) {
            source.value = JSON.stringify({ data: value, expired: now + (1000 * 60 * expired) });
        } else {
            source.value = JSON.stringify({ data: value, expired: now + (1000 * 60) });
        }
        localStorage.setItem(source.key, source.value);
    },
    get(key) {
        const now = Date.now();

        let source = { key: key, value: null };

        if(localStorage.getItem(key)==null){
            return null;
        }
        /* 获取 localStorage 存储信息 赋值给 source 对象 */
        source.value = JSON.parse(localStorage.getItem(source.key));

        /* 如果key 有效  判断当前时间 是否超过 失效时间 */
        if (source.value) {

            if (now >= source.value.expired) {
                /* 超过失效时间 删除 储存内容  */
                this.remove(source.key);
                return null;
            } else {
                return source.value.data;
            }
        }
    },
    remove(key) {
        localStorage.removeItem(key);
    },expiredtime(key) {
        //获取失效时间
        const now = Date.now();

        let source = { key: key, value: null };
        /* 从缓存中取出 信息*/
        source.value = JSON.parse(localStorage.getItem(source.key));

        /* 判断 key 是否失效 */
        if (source.value) {
            /* 获取失效时间 */
            let expired = source.value.expired;
            source.value.expired = source.value.expired = moment(expired).diff(moment(now), 'seconds');
            return source.value.expired;
        } else {
            return;
        }

    },
}

/*export default  用于导出 函数   类中只能定义一个 其他类通过此对象可调用 该类所有方法*/
export default storage;