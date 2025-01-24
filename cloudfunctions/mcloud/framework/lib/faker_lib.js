﻿/**
 * Notes: 测试数据构造类
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY wxid_kyh093u96kxb22 (wechat)
 * Date: 2021-05-26 14:00:00 
 */ 
const timeUtil = require('../utils/time_util.js');


/** 随机获取数据 */
function getRnd(arr, isNullable = false, ex = '') {

	if (isNullable) { // 允许为空
		let rd = getIntBetween(0, 1);
		if (rd % 2 == 0) return '';
	}


	if (!Array.isArray(arr)) {
		arr = arr.replace(/ /g, '').replace(/，/g, ',').split(',');
	}

	let exArr = ex.replace(/ /g, '').replace(/，/g, ',').split(',');
	let ret = '';

	let i = 0;
	while (true) {
		i++;
		if (i > 1000) return '';

		ret = arr[Math.floor((Math.random() * arr.length))];
		if (!exArr.includes(ret))
			return ret;
	}

}

/** 省份 */
function getProvince(isNullable = false, ex = '') {
	let data = ['北京市', '天津市', '河北省', '山西省',
		'内蒙古自治区', '辽宁省', '吉林省',
		'黑龙江省', '上海市', '江苏省',
		'浙江省', '安徽省', '福建省', '江西省',
		'山东省', '河南省', '湖北省', '湖南省',
		'广东省', '广西壮族自治区', '海南省',
		'重庆市', '四川省', '贵州省', '云南省',
		'西藏自治区', '陕西省', '甘肃省', '青海省',
		'宁夏回族自治区', '新疆维吾尔自治区',
		'香港特别行政区', '澳门特别行政区', '台湾省'
	];
	return getRnd(data, isNullable, ex);
}


function getProvinceAbbr(isNullable = false, ex = '') {
	let data = ['京', '皖', '渝', '闽',
		'甘', '粤', '桂', '黔',
		'琼', '冀', '豫', '黑',
		'鄂', '湘', '吉', '苏',
		'赣', '辽', '蒙', '宁',
		'青', '鲁', '晋', '陕',
		'沪', '川', '津', '藏',
		'新', '滇', '浙', '港',
		'澳', '台'
	];
	return getRnd(data, isNullable, ex);
}

/** 城市 */
function getCity(isNullable = false, ex = '') {
	let data = ['北京', '上海', '天津', '重庆',
		'哈尔滨', '长春', '沈阳', '呼和浩特',
		'石家庄', '乌鲁木齐', '兰州', '西宁',
		'西安', '银川', '郑州', '济南',
		'太原', '合肥', '武汉', '长沙',
		'南京', '成都', '贵阳', '昆明',
		'南宁', '拉萨', '杭州', '南昌',
		'广州', '福州', '海口',
		'香港', '澳门'
	];
	return getRnd(data, isNullable, ex);
}

/** 地区 */
function getArea(isNullable = false, ex = '') {
	let data = ['西夏区', '永川区', '秀英区', '高港区',
		'清城区', '兴山区', '锡山区', '清河区',
		'龙潭区', '华龙区', '海陵区', '滨城区',
		'东丽区', '高坪区', '沙湾区', '平山区',
		'城北区', '海港区', '沙市区', '双滦区',
		'长寿区', '山亭区', '南湖区', '浔阳区',
		'南长区', '友好区', '安次区', '翔安区',
		'沈河区', '魏都区', '西峰区', '萧山区',
		'金平区', '沈北新区', '孝南区', '上街区',
		'城东区', '牧野区', '大东区', '白云区',
		'花溪区', '吉利区', '新城区', '怀柔区',
		'六枝特区', '涪城区', '清浦区', '南溪区',
		'淄川区', '高明区', '金水区', '中原区',
		'高新开发区', '经济开发新区', '新区'
	];
	return getRnd(data, isNullable, ex);
}

/** 街道 */
function getStreet(isNullable = false, ex = '') {
	let data = '朱雀大街,太乙路,太白路,太华路,长乐坊,长樱路,案板街,竹笆市,骡马市,东木头市,西木头市,安仁坊,端履门,德福巷,洒金桥,冰窖巷,菊花园,下马陵,粉巷,索罗巷,后宰门,书院门,炭市街,马厂子,景龙池,甜水井,柏树林,桃花坞,人民路,解放路,黄河路,长江路,中山路,抚顺街,天津街,上海路,胜利路,西安路,长春路,太原街,沈阳路,鞍山路,五四路,唐山街,武汉街,延安路,朝阳街,鲁迅路,八一路,东北路,华南路,华北路,山东路,松江路,东方路,南沙街';
	return getRnd(data, isNullable, ex);
}

/**  门牌地址 */
function getAddress() {
	return getProvince() + '' + getCity() + '市' + getArea() + '' + getStreet() + getIntBetween(1, 100) + '号';
}

/** 国家 */
function getCountry(isNullable = false, ex = '') {
	let data = ['阿富汗', '阿拉斯加', '阿尔巴尼亚', '阿尔及利亚',
		'安道尔', '安哥拉', '安圭拉岛英', '安提瓜和巴布达',
		'阿根廷', '亚美尼亚', '阿鲁巴岛', '阿森松', '澳大利亚',
		'奥地利', '阿塞拜疆', '巴林', '孟加拉国', '巴巴多斯',
		'白俄罗斯', '比利时', '伯利兹', '贝宁', '百慕大群岛',
		'不丹', '玻利维亚', '波斯尼亚和黑塞哥维那', '博茨瓦纳',
		'巴西', '保加利亚', '布基纳法索', '布隆迪', '喀麦隆',
		'加拿大', '加那利群岛', '佛得角', '开曼群岛', '中非',
		'乍得', '智利', '圣诞岛', '科科斯岛', '哥伦比亚',
		'巴哈马国', '多米尼克国', '科摩罗', '刚果', '科克群岛',
		'哥斯达黎加', '克罗地亚', '古巴', '塞浦路斯', '捷克',
		'丹麦', '迪戈加西亚岛', '吉布提', '多米尼加共和国',
		'厄瓜多尔', '埃及', '萨尔瓦多', '赤道几内亚',
		'厄立特里亚', '爱沙尼亚', '埃塞俄比亚', '福克兰群岛',
		'法罗群岛', '斐济', '芬兰', '法国', '法属圭亚那',
		'法属波里尼西亚', '加蓬', '冈比亚', '格鲁吉亚', '德国',
		'加纳', '直布罗陀', '希腊', '格陵兰岛', '格林纳达',
		'瓜德罗普岛', '关岛', '危地马拉', '几内亚', '几内亚比绍',
		'圭亚那', '海地', '夏威夷', '洪都拉斯', '匈牙利', '冰岛',
		'印度', '印度尼西亚', '伊郎', '伊拉克', '爱尔兰', '以色列',
		'意大利', '科特迪瓦', '牙买加', '日本', '约旦', '柬埔塞',
		'哈萨克斯坦', '肯尼亚', '基里巴斯', '朝鲜', '韩国', '科威特',
		'吉尔吉斯斯坦', '老挝', '拉脱维亚', '黎巴嫩', '莱索托',
		'利比里亚', '利比亚', '列支敦士登', '立陶宛', '卢森堡',
		'马其顿', '马达加斯加', '马拉维', '马来西亚', '马尔代夫',
		'马里', '马耳他', '马里亚纳群岛', '马绍尔群岛', '马提尼克',
		'毛里塔尼亚', '毛里求斯', '马约特岛', '墨西哥', '密克罗尼西亚',
		'中途岛', '摩尔多瓦', '摩纳哥', '蒙古', '蒙特塞拉特岛',
		'摩洛哥', '莫桑比克', '缅甸', '纳米比亚', '瑙鲁', '尼泊尔',
		'荷兰', '荷属安的列斯群岛', '新喀里多尼亚群岛', '新西兰',
		'尼加拉瓜', '尼日尔', '尼日利亚', '纽埃岛', '诺福克岛',
		'挪威', '阿曼', '帕劳', '巴拿马', '巴布亚新几内亚', '巴拉圭',
		'秘鲁', '菲律宾', '波兰', '葡萄牙', '巴基斯坦', '波多黎各',
		'卡塔尔', '留尼汪岛', '罗马尼亚', '俄罗斯', '卢旺达',
		'东萨摩亚', '西萨摩亚', '圣马力诺', '圣皮埃尔岛及密克隆岛',
		'圣多美和普林西比', '沙特阿拉伯', '塞内加尔', '塞舌尔',
		'新加坡', '斯洛伐克', '斯洛文尼亚', '所罗门群岛', '索马里',
		'南非', '西班牙', '斯里兰卡', '圣克里斯托弗和尼维斯',
		'圣赫勒拿', '圣卢西亚', '圣文森特岛', '苏丹', '苏里南',
		'斯威士兰', '瑞典', '瑞士', '叙利亚', '塔吉克斯坦', '坦桑尼亚',
		'泰国', '阿拉伯联合酋长国', '多哥', '托克劳群岛', '汤加',
		'特立尼达和多巴哥', '突尼斯', '土耳其', '土库曼斯坦',
		'特克斯和凯科斯群岛(', '图瓦卢', '美国', '乌干达', '乌克兰',
		'英国', '乌拉圭', '乌兹别克斯坦', '瓦努阿图', '梵蒂冈',
		'委内瑞拉', '越南', '维尔京群岛', '维尔京群岛和圣罗克伊',
		'威克岛', '瓦里斯和富士那群岛', '西撒哈拉', '也门', '南斯拉夫',
		'扎伊尔', '赞比亚', '桑给巴尔', '津巴布韦', '中华人民共和国', '中国'
	];
	return getRnd(data, isNullable, ex);
}


/** 公司简称 */
function getCompanyPrefix(isNullable = false, ex = '') {
	let data = ['超艺', '和泰', '九方', '鑫博腾飞', '戴硕电子',
		'济南亿次元', '海创', '创联世纪', '凌云', '泰麒麟',
		'彩虹', '兰金电子', '晖来计算机', '天益', '恒聪百汇',
		'菊风公司', '惠派国际公司', '创汇', '思优', '时空盒数字',
		'易动力', '飞海科技', '华泰通安', '盟新', '商软冠联',
		'图龙信息', '易动力', '华远软件', '创亿', '时刻',
		'开发区世创', '明腾', '良诺', '天开', '毕博诚', '快讯',
		'凌颖信息', '黄石金承', '恩悌', '雨林木风计算机',
		'双敏电子', '维旺明', '网新恒天', '数字100', '飞利信',
		'立信电子', '联通时科', '中建创业', '新格林耐特',
		'新宇龙信息', '浙大万朋', 'MBP软件', '昂歌信息',
		'万迅电脑', '方正科技', '联软', '七喜', '南康', '银嘉',
		'巨奥', '佳禾', '国讯', '信诚致远', '浦华众城', '迪摩',
		'太极', '群英', '合联电子', '同兴万点', '襄樊地球村',
		'精芯', '艾提科信', '昊嘉', '鸿睿思博', '四通', '富罳',
		'商软冠联', '诺依曼软件', '东方峻景', '华成育卓', '趋势',
		'维涛', '通际名联'
	];
	return getRnd(data, isNullable, ex);
}

/** 公司类型 */
function getCompanyType(isNullable = false, ex = '') {
	let data = ['科技', '网络', '信息', '传媒', '集团', '控股', '投资', '制造'];
	return getRnd(data, isNullable, ex);
}

/** 公司名 */
function getCompany(isNullable = false, ex = '') {
	if (getNullable(isNullable)) return '';

	return getCompanyPrefix(false, ex) + getCompanyType() + '有限公司';
}

/** 内容 */
function getContent(size = 1, isNullable = false, ex = '') {
	if (getNullable(isNullable)) return '';

	let data = [
		'燕舞，燕舞，一曲歌来一片情。',
		'康师傅方便面，好吃看得见。',
		'不要太潇洒！',
		'让一亿人先聪明起来。',
		'共创美的前程，共度美的人生。',
		'省优，部优，葛优？',
		'喝孔府宴酒，做天下文章。',
		'健康成就未来。',
		'牙好，胃口就好，身体倍儿棒，吃嘛嘛香。',
		'永远的绿色，永远的秦池。',
		'坐红旗车，走中国路。',
		'要想皮肤好，早晚用大宝。',
		'孔府家酒，叫人想家。',
		'补钙新观念，吸收是要害。',
		'喝汇源果汁，走健康之路。',
		'爱的就是你!',
		'一种可以世袭的古典浪漫',
		'实力创造价值',
		'爱生活，爱拉芳！',
		'人类失去联想，世界将会怎样？',
		'做女人挺好！',
		'世界在你眼中？',
		'今天你有否亿唐？',
		'只溶在口，不溶在手。',
		'三千烦恼丝，健康新开始。',
		'维维豆奶，欢乐开怀。',
		'我们的光彩来自你的风采。',
		'钻石恒久远，一颗永流传。',
		'放我的真心在你的手心。',
		'小身材，大味道。',
		'牛奶香浓，丝般感受。',
		'聆听并不代表沉默，有时安静也是一种力量。',
		'滴滴香浓，意犹未尽。',
		'水晶之恋，一生不变。',
		'中国移动通信，沟通从心开始！',
		'网易，网聚人的力量！',
		'科技以人为本，诺基亚',
		'我们一直在努力！',
		'阳光总在风雨后',
		'男人对西服的要求，就是女人对男人的要求',
		'晚报，不晚报',
		'原来生活可以更美的',
		'明天的明天，你还会送我“水晶之恋”吗？',
		'卫浴出出进进的快感',
		'有家就有联合利华',
		'减脂减肥，其实是一种生活态度',
		'人头马一开，好事自然来。',
		'假如五指一样长，怎能满足用户不同需求？',
		'新飞广告做的好，不好新飞冰箱好',
		'传奇品质，百年张裕',
		'李宁：把出色留给自己',
		'一旦拥有，别无选择',
		'科技让你更轻松',
		'情系中国结，联通四海心',
		'海尔，中国造',
		'SOHU：足迹生活每一天',
		'果冻我要喜之郎',
		'国宝大熊猫，心纯天自高',
		'世界因为不同',
		'放低偏见，你会有出色发现！',
		'Just',
		'创意似金，敬业如牛',
		'不要让男人一手把握',
		'如同情人的手',
		'金窝银窝，不如自己的安乐窝。',
		'没有什么大不了的',
		'时间因我存在',
		'只要有梦想',
		'南方周末',
		'时间改变一切',
		'地球人都知道了',
		'众里寻他千百度，想要几度就几度',
		'您身边的银行，可信赖的银行',
		'三叶钢琴：学琴的孩子不会变坏',
		'柯达：串起生活每一刻',
		'大众甲克虫汽车：想想还是小的好',
		'一直被模拟,从未被超越',
		'幸福生活',
		'朗讯的创造力科技的原动力',
		'事事因你而出色',
		'运动之美，世界共享',
		'鹤舞白沙',
		'想知道“清嘴”的味道吗？',
		'弹指一挥间，世界皆互联',
		'更多选择、更多欢笑',
		'方太，让家的感觉更好',
		'世上仅此一件，今生与你结缘！',
		'白里透红与众不同',
		'没有蛀牙-佳洁士',
		'有线的价值',
		'享受快乐科技',
		'四海一家的解决之道',
		'娃哈哈纯净水：爱你等于爱自己',
		'农民山泉：有点甜',
		'博大精深，西门子',
		'一切尽在把握',
		'声声百思特，遥遥两相知',
		'一呼天下应',
		'让我们做得更好！',
		'暖和亲情，金龙鱼的大家庭。',
		'自然最健康，绿色好心情',
		'支起网络世界',
		'立邦漆：处处放光彩！',
		'fm365:真情互动！',
		'庄重一生，吉祥一生。',
		'人人都为礼品愁，我送北极海狗油。',
		'假如说人生的离合是一场戏，那么百年的好合更是早有安排！',
		'一品黄山天高云淡',
		'上上下下的享受！',
		'我是、我行、我素',
		'让无力者有力，让悲观者前行',
		'金利来—-男人的世界！',
		'百衣百顺',
		'聪明何必绝顶，慧根长留',
		'水往高处流',
		'大石化小，小石化了！',
		'“闲”妻良母',
		'“口服”，“心服”！',
		'盛满青春的秘密！',
		'三十六计走为上',
		'为了她的节日，献上您纯金般的心！',
		'用我们的钓线，你可以在鱼儿发现你之前先找到它',
		'生活就是一场运动，喝下它。',
		'选择维聚阿尔，已经表明你心明眼亮。',
		'佳能，我们看得见你想表达什么。',
		'天天都是春天',
		'假如你不来，广告明星就是他',
		'享受黑夜中偷拍的快感！',
		'彩信发送动人一刻',
		'灵感点亮生活!',
		'聪明演绎，无处不在！',
		'事业我一定争取，对你我从未放弃!',
		'波导手机，手机中的战斗机',
		'鄂尔多斯羊绒衫暖和全世界',
		'洁婷245再大的动作也不要紧',
		'做光明的牛，产光明的奶',
		'假如你的汽车会游泳的话，请照直开，不必刹车。',
		'永远要让驾驶执照比你自己先到期。',
		'请记住，上帝并不是十全十美的，它给汽车预备了备件，而人没有。',
		'小别意酸酸，欢聚心甜甜。',
		'除钞票外，承印一切。',
		'更多欢乐，更多选择',
		'美由你做主',
		'由我天地宽',
		'Sun是太阳，Java是月亮。',
		'不断创新，因为专心',
		'趁早下『斑』，请勿『痘』留。',
		'创新就是生活',
		'有一个漂亮的地方，万科四季花城',
		'建筑无限生活',
		'臭名远扬，香飘万里',
		'尝尝欢笑，经常麦当劳',
		'深入成就深度',
		'出色湖南，红网了然！',
		'因为网络，地球如村！',
		'一种质感',
		'恒久期盼',
		'繁荣民族文化',
		'不信，死给你看！',
		'天生的，强生的',
		'雪津啤酒，真情的味道！',
		'听世界，打天下',
		'雅芳比女人更了解女人',
		'Sun是太阳，Java是月亮。',
		'中国网通',
		'无线你的无限',
		'家有三洋，冬暖夏凉',
		'倾诉冬日暖语',
		'谁让我心动？',
		'灵活，让篮球场不再是一个平面',
		'别吻我，我怕修。',
		'一呼四应！',
		'无所不包！',
		'当之无愧',
		'以帽取人！',
		'一毛不拔！',
		'自讨苦吃！',
		'成功与科技共辉映',
		'没有最',
	];

	if (size == 1)
		return getRnd(data, false, ex);
	else {
		ret = '';
		for (let i = 0; i < size; i++) {
			ret += getRnd(data, false, ex) + ', ';
		}
		return ret;
	}
}

/** 获得一句话 */
function getWord(isNullable = false, ex = '') {
	if (getNullable(isNullable)) return '';

	let ret = getContent(1, false, ex);
	ret = ret.replace('。', '').replace('！', '').replace('？', '').replace('“', '”').replace('：', '');
	return ret;
}

/** 星期 */
function getWeek(isNullable = false, ex = '') {
	let data = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	return getRnd(data, isNullable, ex);
}

/** 月份 */
function getMonth(isNullable = false, ex = '') {
	let data = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
	return getRnd(data, isNullable, ex);
}

/** 获得姓名 */
function getFirstName(isNullable = false, ex = '') {
	let data = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴',
		'徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗',
		'梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧',
		'程', '曹', '袁', '邓', '许', '傅', '沉', '曾', '彭', '吕',
		'苏', '卢', '蒋', '蔡', '贾', '丁', '林', '薛', '叶', '阎',
		'余', '潘', '杜', '戴', '夏', '钟', '汪', '田', '任', '姜',
		'范', '方', '石', '姚', '谭', '廖', '邹', '熊', '金', '陆',
		'郝', '孔', '白', '崔', '康', '毛', '邱', '秦', '江', '史',
		'顾', '侯', '邵', '孟', '龙', '万', '段', '雷', '钱', '汤',
		'尹', '黎', '易', '常', '武', '乔', '贺', '赖', '龚', '文',
		'庞', '樊', '兰', '殷', '施', '陶', '洪', '翟', '安', '颜',
		'倪', '严', '牛', '温', '芦', '季', '俞', '章', '鲁', '葛',
		'伍', '韦', '申', '尤', '毕', '聂', '丛', '焦', '向', '柳',
		'邢', '路', '岳', '齐', '沿', '梅', '莫', '庄', '辛', '管',
		'祝', '左', '涂', '谷', '祁', '时', '舒', '耿', '牟', '卜',
		'路', '詹', '关', '苗', '凌', '费', '纪', '靳', '盛', '童',
		'欧', '甄', '项', '曲', '成', '游', '阳', '裴', '席', '卫',
		'查', '屈', '鲍', '位', '覃', '霍', '翁', '隋', '植', '甘',
		'景', '薄', '单', '包', '司', '柏', '宁', '柯', '阮', '桂',
		'闵', '欧阳', '解', '强', '柴', '华', '车', '冉', '房', '边',
		'辜', '吉', '饶', '刁', '瞿', '戚', '丘', '古', '米', '池',
		'滕', '晋', '苑', '邬', '臧', '畅', '宫', '来', '嵺', '苟',
		'全', '褚', '廉', '简', '娄', '盖', '符', '奚', '木', '穆',
		'党', '燕', '郎', '邸', '冀', '谈', '姬', '屠', '连', '郜',
		'晏', '栾', '郁', '商', '蒙', '计', '喻', '揭', '窦', '迟',
		'宇', '敖', '糜', '鄢', '冷', '卓', '花', '仇', '艾', '蓝',
		'都', '巩', '稽', '井', '练', '仲', '乐', '虞', '卞', '封',
		'竺', '冼', '原', '官', '衣', '楚', '佟', '栗', '匡', '宗',
		'应', '台', '巫', '鞠', '僧', '桑', '荆', '谌', '银', '扬',
		'明', '沙', '薄', '伏', '岑', '习', '胥', '保', '和', '蔺'
	];
	return getRnd(data, isNullable, ex);
}


/** 女生名 */
function getFemaleName(isNullable = false, ex = '') {
	if (getNullable(isNullable)) return '';

	let data = ['芳', '娜', '敏', '静', '敏静', '秀英', '丽', '洋', '艳', '娟',
		'文娟', '君', '文君', '珺', '霞', '明霞', '秀兰', '燕', '芬', '桂芬',
		'玲', '桂英', '丹', '萍', '华', '红', '玉兰', '桂兰', '英', '梅',
		'莉', '秀珍', '雪', '依琳', '旭', '宁', '婷', '馨予', '玉珍', '凤英',
		'晶', '欢', '玉英', '颖', '红梅', '佳', '倩', '琴', '兰英', '云',
		'洁', '爱华', '淑珍', '春梅', '海燕', '晨', '冬梅', '秀荣', '瑞', '桂珍',
		'莹', '秀云', '桂荣', '秀梅', '丽娟', '婷婷', '玉华', '琳', '雪梅', '淑兰',
		'丽丽', '玉', '秀芳', '欣', '淑英', '桂芳', '丽华', '丹丹', '桂香', '淑华',
		'秀华', '桂芝', '小红', '金凤', '文', '利', '楠', '红霞', '瑜', '桂花',
		'璐', '凤兰', '腊梅', '瑶', '嘉', '怡', '冰冰', '玉梅', '慧', '婕'
	];
	return getFirstName(false, ex) + getRnd(data, false, ex);
}

/** 男生名 */
function getMaleName(isNullable = false, ex = '') {
	if (getNullable(isNullable)) return '';

	let data = ['伟', '强', '磊', '洋', '勇', '军', '杰', '涛', '超', '明',
		'刚', '平', '辉', '鹏', '华', '飞', '鑫', '波', '斌', '宇',
		'浩', '凯', '健', '俊', '帆', '帅', '旭', '宁', '龙', '林',
		'欢', '阳', '建华', '亮', '成', '畅', '建', '峰', '建国', '建军',
		'晨', '瑞', '志强', '兵', '雷', '东', '欣', '博', '彬', '坤',
		'全安', '荣', '岩', '杨', '文', '利', '楠', '建平', '嘉俊', '晧',
		'建明', '子安', '新华', '鹏程', '学明', '博涛', '捷', '文彬', '楼', '鹰',
		'松', '伦', '超', '钟', '瑜', '振国', '洪', '毅', '昱然', '哲',
		'翔', '翼', '祥', '国庆', '哲彦', '正诚', '正豪', '正平', '正业', '志诚',
		'志新', '志勇', '志明', '志强', '志文', '致远', '智明', '智勇', '智敏', '智渊'
	];
	return getFirstName(false, ex) + getRnd(data, false, ex);
}

/** 随机获得姓名 */
function getName(isNullable = false, ex = '') {
	if (getNullable(isNullable)) return '';

	let rd = Math.round(Math.random());
	return (rd % 2 == 0) ? getFemaleName(false, ex) : getMaleName(false, ex);
}

/** 身份证号码 */
function getIdCard(birthday = '', isNullable = false) {
	if (getNullable(isNullable)) return '';

	let coefficientArray = ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"]; // 加权因子
	let lastNumberArray = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]; // 校验码
	let address = "420101"; // 住址

	if (!birthday)
		birthday = "19810101"; // 生日

	let s = Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString();
	let array = (address + birthday + s).split("");
	let total = 0;
	for (i in array) {
		total = total + parseInt(array[i]) * parseInt(coefficientArray[i]);
	}
	let lastNumber = lastNumberArray[parseInt(total % 11)];
	let str = address + birthday + s + lastNumber;
	return str;

}

/** 手机号码 */
function getMobile(isNullable = false, ex = '') {

	if (getNullable(isNullable)) return '';

	let data = ['133', '149', '153', '173', '177', '180', '181', '189', '190', '191', '193', '199', '130', '131', '132', '145', '155', '156', '166', '167', '171', '175', '176', '185', '186', '196', '134', '135', '136', '137', '138', '139', '147', '148', '150', '151', '152', '157', '158', '159', '172', '178', '182', '183', '184', '187', '188', '195', '197', '198'];

	return getRnd(data, false, ex) + getInt(8);
}

/** 电话号码 */
function getPhone(isNullable = false, ex = '') {

	if (getNullable(isNullable)) return '';

	let data = ['010', '021', '022', '023', '020', '024', '025', '027', '028', '029', '0755', '0731', '0769'];

	return getRnd(data, false, ex) + '-' + getInt(8);
}

/** 常用英文单词 */
function getEnWord(isNullable = false, ex = '') {
	let data = 'earthday,org,suggests,that,every,household,take,time,this,earth,day,to,perform,a,plastic,audit,which,involves,counting,how,many,plastic,containers,wraps,bottles,and,bags,are,purchased,for,at,home,use,it,may,surprise,you,how,many,you,use,until,you,start,counting,while,were,not,saying,that,you,have,to,get,rid,of,every,single,ounce,of,plastic,in,your,home,it,is,important,to,be,aware,of,your,familys,plastic,usage,and,to,take,time,to,research,more,sustainable,products,and,start,to,incorporate,them,into,your,daily,life,simple,swaps2,like,glass,containers,instead,of,plastic,or,stainless3,steel,bottles,instead,of,single,use,plastics,can,go,a,long,way,to,making,a,difference';

	return getRnd(data, isNullable, ex);
}

/** 常用域名 */
function getDomain(isNullable = false, ex = '') {

	if (getNullable(isNullable)) return '';

	let data = 'com,net,org,cn,hk,us,uk,jp,kr';

	return '.' + getRnd(data, false, ex);
}

/** 常用邮箱 */
function getEmail(isNullable = false, ex = '') {
	if (getNullable(isNullable)) return '';

	let data = 'qq.com,163.com,gmail.com,263.com,tom.com,163.net,189.cn,sina.com,sohu.com,360.com,tencent.com,china.com,netease.com,126.com,139.com';

	return getEnWord() + '@' + getRnd(data, false, ex);
}

/** 获取时间戳 step 秒 */
function getTimestamp(step = 0) {
	return timeUtil.time() + step * 1000;
}

/**
 * 以当天为基点，获取随机时间戳，默认为当天
 * @param {*} min  起始天
 * @param {*} max  终止天
 */
function getAddTimestamp(min = 0, max = 1) {
	let now = timeUtil.timestamp2Time(timeUtil.time(), 'Y-M-D'); //转为当天0点
	now = timeUtil.time2Timestamp(now);
	return now + getIntBetween(min * 86400 * 1000, max * 86400 * 1000);
}

/** 生日 fmt=Y, Y-M, Y-M-D */
function getDate(start = '1900', end = '2020', fmt = 'Y') {

	if (fmt == 'Y') {
	start = start + '-01-01 00:00:00';
		end = end + '-12-31 23:59:59';
	}
	else if (fmt == 'Y-M') {
		start = start + '-01 00:00:00';
		end = end + '-28 23:59:59';
	}
	else if (fmt == 'Y-M-D') {
		start = start + ' 00:00:00';
		end = end + ' 23:59:59';
	}

	start = timeUtil.time2Timestamp(start);
	end = timeUtil.time2Timestamp(end);

	let time = getIntBetween(start, end);
	return timeUtil.timestamp2Time(time, 'Y-M-D');
}

/** 整数 */
function getInt(size) {
	let t = '';
	for (var i = 0; i < size; i++) {
		t += Math.floor(Math.random() * 10);
	}
	return t;
}

/** 随机数组 */
function getRdArr(arr) {
	return getRnd(arr);
}

/** 随机数 */
function getIntBetween(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

/** 随机字符串 */
function getStr(size) {

	let text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let rdmIndex = text => Math.random() * text.length | 0;
	let rdmString = '';
	for (; rdmString.length < size; rdmString += text.charAt(rdmIndex(text)));
	return rdmString;

}

/** 随机数字字符串 */
function getIntStr(size) {

	let text = '0123456789';
	let rdmIndex = text => Math.random() * text.length | 0;
	let rdmString = '';
	for (; rdmString.length < size; rdmString += text.charAt(rdmIndex(text)));
	return String(rdmString);

}

/** 随机字符串小写 */
function getStrLower(size) {
	return getStr(size).toLowerCase();
}

/** 随机字符串大写 */
function getStrUpper(size) {
	return getStr(size).toUpperCase();
}

function getUuid() {
	let s = [];
	let hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	let uuid = s.join("");
	return uuid;
}

/** 学院 */
function getCollege(isNullable = false, ex = '') {
	let data = '地球科学学院,环境科学与工程学院,化学与生物工程学院,材料科学与工程学院,土木与建筑工程学院,测绘地理信息学院,信息科学与工程学院,机械与控制工程学院,珠宝学院,马克思主义学院,公共管理与传媒学院,商学院,旅游与风景园林学院,艺术学院,外国语学院,理学院,文学与新闻传播学院,外国语学院,建筑与艺术学院,商学院,法学院,马克思主义学院,公共管理学院,数学与统计学院,物理与电子学院,化学化工学院,文学系,法学系,哲学系,医学系,力学系,理学系,数学系,物理系,化学系,计算机系,自动化系,口腔医学系,英语系,外语系,法语系,德语系,日语系,西班牙语系';

	return getRnd(data, isNullable, ex);
}

/** 专业 */
function getItem(isNullable = false, ex = '') {
	let data = '音乐表演,音乐学,作曲与作曲技术理论,舞蹈表演,舞蹈学,舞蹈编导,舞蹈教育,航空服务艺术与管理,流行音乐,音乐治疗,流行舞蹈,表演,戏剧学,电影学,戏剧影视文学,广播电视编导,戏剧影视导演,戏剧影视美术设计,录音艺术,播音与主持艺术,动画,美术学,绘画,雕塑,摄影,书法学,中国画,实验艺术,跨媒体艺术,文物保护与修复,漫画,艺术设计学,视觉传达设计,环境设计,产品设计,服装与服饰设计,公共艺术,工艺美术,数字媒体艺术,艺术与科技,陶瓷艺术设计,新媒体设计,包装设计,教育学,科学教育,人文教育,教育技术学,艺术教育,学前教育,小学教育,特殊教育,华文教育,教育康复学,卫生教育,法学,知识产权,监狱学,信用风险管理与法律防控,国际经贸规则,司法警察学,社区矫正,工商管理,市场营销,会计学,财务管理,国际商务,人力资源管理,审计学,资产评估,物业管理,文化产业管理,劳动关系,体育经济与管理,财务会计教育,市场营销教育,零售业管理,农林经济管理,农村区域发展 ,公共事业管理,行政管理,劳动与社会保障,土地资源管理,城市管理,海关管理,交通管理,海事管理,公共关系学,健康服务与管理,海警后勤管理,数学与应用数学,信息与计算科学,数理基础科学,数据计算及应用 ,物理学,应用物理学,核物理,声学,系统科学与工程,地理科学,自然地理与资源环境,人文地理与城乡规划,地理信息科学 ,机械设计制造及其自动化,材料成型及控制工程,机械电子工程,工业设计,过程装备与控制工程,车辆工程,汽车服务工程,机械工艺技术,微机电系统工程,机电技术教育,汽车维修工程教育,智能制造工程,材料科学与工程材料物理,材料化学,冶金工程,金属材料工程,无机非金属材料工程,高分子材料与工程,复合材料与工程,粉体材料科学与工程,宝石及材料工艺学,焊接技术与工程,功能材料,纳米材料与技术,新能源材料与器件,材料设计科学与工程,光电信息科学与工程,信息工程,广播电视工程,水声工程,电子封装技术,集成电路设计与集成系统,医学信息工程,电磁场与无线技术,电波传播与天线,电子信息科学与技术,电信工程及管理,应用电子技术教育,数字媒体技术,智能科学与技术,空间信息与数字技术,电子与计算机工程,数据科学与大数据技术,网络空间安全,新媒体技术,电影制作,保密技术,服务科学与工程,虚拟现实技术,区块链工程,建筑环境与能源应用工程,给排水科学与工程,建筑电气与智能化,城市地下空间工程,道路桥梁与渡河工程,铁道工程,智能建造,土木、水利与海洋工程,土木、水利与交通工程,采矿工程,石油工程,矿物加工工程,油气储运工程,矿物资源工程,海洋油气工程 ,纺织工程,服装设计与工程,非织造材料与工程,服装设计与工艺教育,丝绸设计与工程';

	return getRnd(data, isNullable, ex);
}

/** 行业 */
function getTrade(isNullable = false, ex = '') {
	let data = ['经营', '销售', '市场营销', '公关', '客户服务', '人力资源', '行政HR', '财务/审计/统计', '文职', '翻译', '计算机/IT', '电子/通讯', '设计', '工业/工厂', '金融/经济', '法律', '机械', '技工', '房地产/土建', '咨询/顾问', '医疗/护理/保健', '服务业', '政府机关', '事业单位', '学生/研究生', '化工', '冶金/地质'];

	return getRnd(data, isNullable, ex);
}

/** 学历 */
function getEdu(isNullable = false, ex = '') {
	let data = '中学,高职,大专,本科,硕士,博士,博士后,其他';

	return getRnd(data, isNullable, ex);
}

/** 职位 */
function getDuty(isNullable = false, ex = '') {
	let data = 'CTO,CEO,CFO,研发,销售,采购,董事长,老板,自由自由者,中层领导,部门经理,大区经理';

	return getRnd(data, isNullable, ex);
}

/** 资源 */
function getResource(isNullable = false, ex = '') {
	let data = '法律咨询,管理咨询,企业辅导,上市辅导,创业交流,投资融资,医疗咨询,教育交流,开发技术交流,研发交流,未来探讨,大宗商品,销售网络共享,艺术品鉴赏,供应链共享,进修交流,财会督导,审计辅导,企业治理,工程监理,硬件生产,小商品生产,电商,二类电商,早教,公考,艺术设计,人力资源,地质勘探,招工招聘,游戏开发,销售采购,市场营销,电子通讯,经济探讨,机械制造,产业经理,轻工业,化工化学,海外电商,企业出海,翻译,心理咨询,餐饮酒店,民宿,旅游自驾,服务业,租车,自媒体新媒体行业,文职人员,军迷,学习共勉,体育活动,打球约饭,户外旅行,文艺青年,小镇青年,斜杠青年,交通运输,民航机票,系统集成,售前服务,维修';

	return getRnd(data, isNullable, ex);
}

/** 评论 */
function getComment(isNullable = false, ex = '') {
	let data = '很用心的活动,谢谢你们,很Nice,很美妙的聚会,学到了新东西,很高兴,难得啊,你们都到家了吗,活动主题是？,大家都很不错,谢谢小姐姐,下次期待在家门口,你们最近有参加吗,好久没搞活动了,我一定准时到达,大家记得不要迟到哦,公交地铁都可以到,有点远,很近啊,要带些什么,有活动须知吗,要带什么东西呢,要提前准备吗?,管饭不？哈哈,可以带宠物吗,和我的女朋友就是这样认识的,开阔了眼界,周末也不能放弃学习,人啊！就是要学到老,我是社恐咋办,很棒的活动！,很不错！期待下次,很高兴认识大家,物超所值,度过了很开心的一天！谢谢主办方,可圈可点，期待下次,认识了新朋友!真不错,难得的周末,难得的假期,活动办得很好,活动还行,希望下次改善,社恐找到了新天地,谢谢大家,今天真的很开心~学到了新知识！认识了新朋友,希望下次再组织这样的活动,好久没参加活动了~今天的感觉真不错,下次活动是哪天？,还会举办这样的活动吗？期待ing,能在我们这边举行就好了！我隔得有点远,认识了一群很真诚的朋友~度过了一个有意义的周末,请问下次还会举行这样的活动吗,下次活动是哪天呢?,我来晚了！下次一定准时,时间有点赶！希望下次安排的更宽裕点,还是有很多槽点~希望下次举办方改进,活动免费不？哈哈,我是来看热闹的,我是来打酱油的,活动很好!我就是个路人甲,为你们点赞~,好开心~haha,你们还好吗,大家晚安,周一要上班了！今天真开心,日知其所无,很有收获,有点乱~希望改进啊,我可以多带一个人么,可以带家属不,有免费的不,有深圳这边的不,有北京这边的不,very good!,See YOU,nice!!!!,我喜欢你们';

	return getRnd(data, isNullable, ex);
}

/** 自我介绍 */
function getMotto(isNullable = false, ex = '') {
	let data = '生无一锥土，常有四海心 ,志在山顶的人，不会贪念山腰的风景 ,人之所以能，是相信能 ,卒子过河，意在吃帅 ,心志要坚，意趣要乐 ,贫困教会贫困者一切 ,欲望以提升热忱，毅力以磨平高山 ,人生不得行胸怀，虽寿百岁犹为无也 ,人之所以异于禽者，唯志而已矣！,每一发奋努力的背后，必有加倍的赏赐 ,治天下者必先立其志 ,以天下为己任 ,一人立志，万夫莫敌 ,志高山峰矮，路从脚下伸 ,鹰爱高飞，鸦栖一枝 ,莫为一身之谋，而有天下之志 ,人之所以能，是相信能,励志短语,没有天生的信心，只有不断培养的信心 ,世上没有绝望的处境，只有对处境绝望的人 ,人格的完善是本，财富的确立是末 ,在年轻人的颈项上，没有什么东西能比事业心这颗灿烂的宝珠 ,壮志与毅力是事业的双翼 ,心有多大，舞台就有多大 ,志正则众邪不生 ,母鸡的理想不过是一把糠 ,死犹未肯输心去，贫亦其能奈我何！,鸟贵有翼，人贵有志 ,有志登山顶，无志站山脚 ,没有一种不通过蔑视忍受和奋斗就可以征服的命运 ,远大的希望造就伟大的人物 ,志不立，天下无可成之事 ,有志者能使石头长出青草来 ,莫找借口失败，只找理由成功 ,男子千年志，吾生未有涯 ,鱼跳龙门往上游 ,有志者，事竟成  ,强行者有志 ,心随朗月高，志与秋霜洁 ,与其当一辈子乌鸦，莫如当一次鹰 ,石看纹理山看脉，人看志气树看材 ,志当存高远 ,任何的限制，都是从自己的内心开始的 ,志，气之帅也 ,一个人如果胸无大志，既使再有壮丽的举动也称不上是伟人  ,立志是事业的大门，工作是登门入室的旅程 ,志气和贫困是患难兄弟，世人常见他们伴在一起 ,失败是成功之母 ,对的，坚持；错的，放弃！,丈夫志不大，何以佐乾坤 ,鸭仔无娘也长大，几多白手也成家  ,我走得很慢，但是我从来不会后退,面对太阳，阴影将落在你的背后,困境之中，饱含机遇,执着于理想，纯粹于当下,不要轻言放弃，否则对不起自己,含泪播种的人一定能含笑收获,日益努力，而后风生水起,若要梦想实现，先从梦中醒来,今天比昨天好，就是希望,希望叫醒你的不是闹钟而是理想,坚定信念的人都是英雄,欲戴皇冠，必承其重,昨日之深渊，来日之浅谈,天越黑，星星越亮,岂能尽如人意，但求无愧我心,世上没什么运气，只有努力去挑战,日出之美便在于它脱胎于最深的黑暗,不要等待机会，而要创造机会,成功的秘诀在于对目标的执着追求,我把苦难挫折当作自己生存的最好导师,黑夜无论怎样悠长，白昼总会到来,海到无边天作岸，山登绝顶我为峰,除了放弃尝试以外没有失败,有梦就别怕痛，想赢就别喊停, 与其羡慕别人，不如自己努力,努力就能成功，坚持确保胜利,永不言败，是成功者的最佳品格,人生没有彩排，每天都是现场直播,火把倒下，火焰依然向上,低头哭过别忘了抬头继续走,有种脾气叫不放弃,风乍起，合当奋意向人生,莫问收获，但问耕耘,即使身在生活，也要做你理想的卧底,我只身前行，却仿佛带着一万雄兵,熬过一切，星光璀璨,没有人帮你，说明你一个人可以,让理想生活的样子清晰可见,趁我们头脑发热，我们要不顾一切,念念不忘，必有回响,一生很短，你要大胆,容易走的路，一般都很拥挤,那些杀不死我们的，终将让我们更强大,你利用时间的方式，就是塑造自己的方式,每一个不曾起舞的日子，都是对生命的辜负,猛兽总是独行，牛羊才成群结队,你迷茫的原因在于读书太少而想的太多,对未来真正的慷慨，是把一切献给现在,没有一点儿疯狂，生活就不值得过,生活在阴沟里，但仍有人仰望星空,怕输的人已经输了,不要忘记人生是要战斗到死, 抱怨身处黑暗，不如提灯前行,患难困苦，是磨炼人格之高等学校,失败不是悲剧，放弃才是,画工须画云中龙，为人须为人中雄,博观而约取，厚积而薄发,志在山顶的人，不会贪恋山腰的风景,别为失败找理由，要为成功找方法,迷失的时候，选择更艰辛的那条路,命是弱者的借口，运是强者的谦词,如果今天不走的话，明天就要跑,今天度过的一天明天就找不回来了,生活绝不会因为你胆小怯懦而饶过你,最可怕的敌人，就是没有坚强的信念,梦想一旦被付诸行动，就会变得神圣,寄言燕雀莫相唣，自有云霄万里高,人若有志，万事可为,志不可一日坠，人不可一日放,苦难，是化了妆的祝福,没有实力的愤怒毫无意义,在避风的港湾里，找不到昂扬的帆,大胆的尝试只等于成功了一半,天才就是无止境刻苦勤奋的能力,你是自己人生的设计师,苦想没盼头，苦干有奔头,世界会向那些有目标和远见的人让路,挫折其实就是迈向成功所应缴的学费,欲望以提升热忱，毅力以磨平高山,用行动祈祷比用言语更能够使上帝了解,志不立，天下无可成之事,志向和热爱是伟大行为的双翼,水激石则鸣，人激志则宏,雄心壮志是茫茫黑夜中的北斗星,贫而懒惰乃真穷，贱而无志乃真贱,目标越接近，困难越增加,绳锯木断，水滴石穿,男儿不展风云志，空负天生八尺躯,天才就是无止境刻苦勤奋的能力,苦难是人生的老师,成功的秘诀，在永不改变既定的目的,平凡的脚步也可以走完伟大的行程,如果你有梦想的话，就要去捍卫它,永远要面对眼前的这些困境,如果我放弃，就是向那些错看我的人屈服,运气，就是机会碰巧撞到了你的努力,哪有什么胜利可言，挺住就意味着一切,过去属于死神，未来属于你自己,失败是坚忍的最后考验,流水在碰到底处时才会释放活力';

	return getRnd(data, isNullable, ex);
}

/** 用户头像 */
function getAvatar(isNullable) {
	if (getNullable(isNullable)) return '';

	return 'https://7265-release-7g51ulsq6451a0a6-1304820041.tcb.qcloud.la/mini/user_pic/' + getIntBetween(1, 200) + '.jpg';
}


/** 是否为空 */
function getNullable(isNullable) {
	if (!isNullable) return false;

	let rd = getIntBetween(0, 1);
	if (rd % 2 == 0)
		return true;
	else
		return false;
}





module.exports = {
	getUuid,
	getRnd,

	getIdCard,

	getProvince,
	getProvinceAbbr,

	getCity,
	getArea,
	getCountry,
	getStreet,
	getAddress,

	getCompany,
	getCompanyPrefix,
	getResource,
	getMotto,
	getComment,

	getContent,
	getWord,

	getWeek,
	getMonth,
	getTimestamp,
	getAddTimestamp,

	getFirstName,
	getFemaleName,
	getMaleName,
	getName,

	getInt,
	getRdArr,
	getIntBetween,
	getIntStr,
	getStr,
	getStrLower,
	getStrUpper,

	getMobile,
	getPhone,

	getEnWord,
	getEmail,
	getDomain,

	getDate,

	getItem,
	getCollege,
	getTrade,
	getEdu,
	getDuty,

	getAvatar
}