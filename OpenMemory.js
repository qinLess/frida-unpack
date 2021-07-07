'use strict';
/**
 * 此脚本在以下环境测试通过
 * android os: 7.1.2 32bit  (64位可能要改OpenMemory的签名)
 * legu: libshella-2.8.so
 * 360:libjiagu.so
 */

// android 10
var symbolAndroid = '_ZN3art13DexFileLoader10OpenCommonEPKhjS2_jRKNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEjPKNS_10OatDexFileEbbPS9_NS3_10unique_ptrINS_16DexFileContainerENS3_14default_deleteISH_EEEEPNS0_12VerifyResultE'
var soName = 'libdexfile.so'

var soFunction = Module.findExportByName(soName, symbolAndroid);
console.log('soFunction: ', soFunction)

Interceptor.attach(soFunction, {
    onEnter: function (args) {
        //dex起始位置
        var begin = args[1]
        //打印magic
        console.log('magic: ', Memory.readUtf8String(begin))
        //dex fileSize 地址
        var address = parseInt(begin, 16) + 0x20
        //dex 大小
        var dex_size = Memory.readInt(ptr(address))

        console.log('dex_size: ', dex_size)
        //dump dex 到/data/data/pkg/目录下
        var file = new File('/com.wanwu.wanwu/' + dex_size + '.dex', 'wb')
        file.write(Memory.readByteArray(begin, dex_size))
        file.flush()
        file.close()
    },
    onLeave: function (retval) {
        if (retval.toInt32() > 0) {
            /* do something */
        }
    }
});
