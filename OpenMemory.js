'use strict';
/**
 * 此脚本在以下环境测试通过
 * android os: 7.1.2 32bit  (64位可能要改OpenMemory的签名)
 * legu: libshella-2.8.so
 * 360:libjiagu.so
 */

// android 10
// var symbolAndroid = '_ZN3art16ArtDexFileLoader10OpenCommonEPKhmS2_mRKNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEjPKNS_10OatDexFileEbbPS9_NS3_10unique_ptrINS_16DexFileContainerENS3_14default_deleteISH_EEEEPNS_13DexFileLoader12VerifyResultE'
// var soName = 'libdexfile.so'

// android 8.1.0
var symbolAndroid = '_ZN3art7DexFile10OpenCommonEPKhmRKNSt3__112basic_stringIcNS3_11char_traitsIcEENS3_9allocatorIcEEEEjPKNS_10OatDexFileEbbPS9_PNS0_12VerifyResultE';
var soName = 'libart.so';

var soFunction = Module.findExportByName(soName, symbolAndroid);
console.log('soFunction: ', soFunction)

Interceptor.attach(soFunction, {
    onEnter: function (args) {
        console.log('args[0]: ', Memory.readUtf8String(args[0]));
        console.log('args[2]: ', Memory.readUtf8String(args[2]));
        console.log('args[3]: ', Memory.readUtf8String(args[3]));
        console.log('args[1]: ', Memory.readUtf8String(args[1]));

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

