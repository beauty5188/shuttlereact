import React, { Component } from 'react';
import './home.css'
import { defaultLine } from '../request/api'
import matouimg from '../asset/img/jichang.png'
import youyunimg from '../asset/img/matou.png'
import dingzhiimg from '../asset/img/yiyuan.png'
import mayunimg from '../asset/img/zhangjiang.png'

class Lineinfo extends Component {
  //定义数据
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    }
  }
  //获取数据
  componentDidMount() {
    defaultLine({
      'lineClassifyId': '1064805524678733825',
      'currPage': 1,
      'pageSize': 30
    }).then(res => {
      console.log(res.data.lineArray)
      this.setState({
        list: res.data.lineArray
      })
    })
  }
  render() {
    const linelist = this.state.list.map((line, index) =>
      <li key={index}>
        <div className='linestate' style={{backgroundImage:"url("+ line.pictureUrl +")"}}>
          <h6><span>{line.lineSubtitle}</span></h6>
          <p>
            <span className='left'>{line.lineName}</span>
            <span className='right'>￥{line.lowestTicketPrice}</span>
          </p>
          </div>
      </li>
    )
    return (
      <ul>{linelist}</ul>
    )
  }
}

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
        <div className='container'>
          <Lineinfo />
        </div>
        <footer></footer>
      </div>
    )
  }
}
export default Home;