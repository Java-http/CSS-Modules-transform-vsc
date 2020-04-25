import * as vscode from 'vscode';
import {STYLE_VARIABLE,IGNORE_PREFIX} from './conf';

/** 去除首尾空格以及中间多余空格 */
export function trim(str:string){
  return str.trim().replace(/\s+/g," ");
}

/** 匹配单词前缀 */
export function matchPrefix(ignorePrefix:string,word:string){
  return ignorePrefix && new RegExp(`^${ignorePrefix}`).test(word);
}

/** 获取配置 */
export function getConf(){
  const styleVariable = vscode.workspace.getConfiguration().get('conf.cssModuleTransform.styleVariable',STYLE_VARIABLE);
  const ignorePrefix = vscode.workspace.getConfiguration().get('conf.cssModuleTransform.ignorePrefix',IGNORE_PREFIX);

  return {
    styleVariable,
    ignorePrefix
  };
}

/**
 * 正则匹配转换
 * @param str 选中文本
 * @param conf 配置
 */
export function transform(str:string,conf: ReturnType<typeof getConf>){
  const {styleVariable,ignorePrefix} = conf;
  const className = /react/.test(vscode.window.activeTextEditor?.document.languageId + '') ? 'className' : 'class';

  return str.replace(new RegExp(`(${className})="([\\w\\s]+)"`,"g"),(_,$1,$2)=>{
    let re='';
    let arr=[];
    let className = $1;
    let value=$2;

    if(trim(value)==='') {return `${className}=""`;};

    arr=trim(value).split(" ");
    if(arr.length===1){
      if(matchPrefix(ignorePrefix,arr[0])) {
        re = `${className}="${arr[0]}"`;
      }else{
        re = `${className}={${styleVariable}.${arr[0]}}`;
      }
    }else{
      let isAllIgnore = true;
      let str=arr.map((item:string)=>{
        if(matchPrefix(ignorePrefix,item)) {
          return item;
        }else{
          isAllIgnore = false;
          return `\${${styleVariable}.${item}}`;
        }
      }).join(" ");

      if(isAllIgnore){
        re = `${className}="${str}"`;
      }else{
        re = `${className}={\`${str}\`}`;
      }
    }

    return re;
  });
}