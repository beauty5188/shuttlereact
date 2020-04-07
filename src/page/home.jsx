import React, { Component } from 'react';
import './home.css'
import {lineClassify} from '../request/api'
import matouimg from '../asset/img/jichang.png'
import youyunimg from '../asset/img/matou.png'
import dingzhiimg from '../asset/img/yiyuan.png'
import mayunimg from '../asset/img/zhangjiang.png'

class Home extends Component {
  render() {
    return (
      <div className='home'>
        <header>
          <table>
            <tbody>
              <tr>
                <td>
                  <img src={matouimg} alt='码头线路'></img>
                  <span>码头线路</span>
                </td>
                <td>
                  <img src={youyunimg} alt='游运线路'></img>
                  <span>游运线路</span>
                </td>
                <td>
                  <img src={dingzhiimg} alt='定制班线'></img>
                  <span>定制班线</span>
                </td>
                <td>
                  <img src={mayunimg} alt='码云线路'></img>
                  <span>码云线路</span>
                </td>
              </tr>
            </tbody>
          </table>
        </header>
        <div></div>
        <footer></footer>
      </div>
    )
  }
  componentDidMount() {
    lineClassify().then(res=>{
      const info = res.data
      console.log(info)
    })
  }
}
export default Home;