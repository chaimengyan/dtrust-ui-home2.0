
import CryptoJS from 'crypto-js';
 
//约定密钥(与后端密钥保持一致)
var key = CryptoJS.enc.Utf8.parse("dtrustSassMobile");// 密钥16位长度字符   内容可自定义
var IV = CryptoJS.enc.Utf8.parse("qP2$bG9;vA0^uW0:");//  密钥偏移量    16位长度字符
 
/**
* AES对称加密 （CBC模式，需要偏移量）
* @param {Object} params 明文参数
*/
export function encrypt(params){
    //明文参数   
    var str = CryptoJS.enc.Utf8.parse(params);
    //加密
    var encryptedData = CryptoJS.AES.encrypt(str, key, {
        mode: CryptoJS.mode.ECB, //AES加密模式  
        padding: CryptoJS.pad.Pkcs7 //填充方式
    });
        console.log("加密前："+params);//加密前：QWEASDZXC
        console.log("加密后："+encryptedData);//加密后：vlgQpBdfVvMplxwOTjxSyQ==	
        return CryptoJS.enc.Base64.stringify(encryptedData.ciphertext); //返回base64格式密文
}
/**
 * AES对称解密
 * @param {Object} params 加密参数
 */
export function decrypt(params){
    //base64格式密文转换
    var base64 = CryptoJS.enc.Base64.parse(params);
    var str = CryptoJS.enc.Base64.stringify(base64);
    //解密
    var decryptedData = CryptoJS.AES.decrypt(str, key, {
        mode: CryptoJS.mode.ECB, //AES加密模式  
        padding: CryptoJS.pad.Pkcs7 //填充方式
    });
        // console.log("解密前："+params);//解密前：vlgQpBdfVvMplxwOTjxSyQ==
        // console.log("解密后："+CryptoJS.enc.Utf8.stringify(decryptedData).toString());//解密后：QWEASDZXC
        return CryptoJS.enc.Utf8.stringify(decryptedData).toString(); //返回明文
}