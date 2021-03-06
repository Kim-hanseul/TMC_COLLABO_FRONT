import React, {useCallback, useEffect, useRef, useState} from 'react'
import { useAppDispatch } from '@/hooks'
import { useDispatch } from 'react-redux'
import {  User, userActions } from '@/modules/users/join'
import { checkIdRequest } from '@/modules/users/check'

type Props = {
  handleChange : (e : React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>) => void;
  handleSubmit : (e : React.FormEvent<HTMLFormElement>) => void;
  checkChange : (e : React.ChangeEvent<HTMLInputElement>) => void;
}

export interface UsernameType{
  username: string
}

export interface CompareType {
  checkIdValue: string,
  checkPwValue: string
}

const Join: React.FC = () => {

  // 회원가입 타입
  const [user, setUser] =useState<User>({
    username:'', password:'', email:'', name:'', phone:'', nickname:'', weight:'', height:'',  gender :''
})
const [username, setUsername] = useState<UsernameType>({username: ''}) // 아이디 중복확인
const [check, setCheck] = useState<CompareType>({checkIdValue: '', checkPwValue: ''})
const [usernameVal, setUsernameVal] = useState(false)
const [nameVal, setNameVal] = useState(false)
const [passwordval, setPasswordVal] = useState(false)
const [emailVal, setEmailVal] = useState(false)
const [passwordSame, setPasswordSame] = useState(false)

const dispatch = useAppDispatch();

const usernameRef  = useRef<HTMLInputElement>(null) //getById
const nameRef  = useRef<HTMLInputElement>(null)
const passwordRef = useRef<HTMLInputElement>(null)
const emailRef = useRef<HTMLInputElement>(null)

const usernameRegex = /^[a-z]+[a-z0-9]{5,19}$/g;
const nameRegex =  /^[가-힣]{2,10}$/
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{7,25}$/
const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/

//inputSet, 유효성 검사
const handleChange = (e: { preventDefault: () => void; target: { name: string; value: string } }) =>{
    e.preventDefault()
    const {name, value} = e.target;
    setUser({...user, [name]: value})
    
   if(e.target === nameRef.current) {
      nameRegex.test(e.target.value) ? setNameVal(true) : setNameVal(false)
    } 
    else if (e.target === usernameRef.current){
      usernameRegex.test(e.target.value) ? setUsernameVal(true) : setUsernameVal(false)
    } 
    else if(e.target === passwordRef.current) {
      passwordRegex.test(e.target.value) ? setPasswordVal(true) : setPasswordVal(false)
    }
    else if(e.target === emailRef.current) {
      emailRegex.test(e.target.value) ? setEmailVal(true) : setEmailVal(false)
   }
}
const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  console.log(`1. 버튼 클릭 및 액션 디스패치 +${JSON.stringify(user)}`)
  dispatch(userActions.joinRequest(user))
   // 리퀘스트 객체를 생성해라 요청 시 객체이름은 request, 또는 response
  console.log(JSON.stringify(user))       // 타입이 {} JSON
  window.location.href = ('/')
  
}
// const checkChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
//   e.target.checked ? setGender({...gender, open: 'false'}) : setGender({...gender, open: 'true'})
// }
const idCheckChange = (e : React.FormEvent<HTMLInputElement>) => {
  e.preventDefault()
  const {name, value} = e.currentTarget
  setUsername({...username, [name]: value})
}
const idCheck = (e : React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault()
  console.log(`중복 체크 아이디 : ${JSON.stringify(username)}`)
  dispatch(checkIdRequest(username))
}
const pwCheckChange = (e : { preventDefault:() => void; target: {name: string ; value: string}}) => {
  e.preventDefault()
  const {name , value} = e.target;
  setCheck({...check, [name] : value })
}
console.log(`0. 회원가입 입력 : ${JSON.stringify(user)}`)
//debugger;
    return(
      
    <form onSubmit = { handleSubmit } >
        <h4 className="h4 mb-3 fw-normal">TMC 가족이 되어주세요 !</h4>
    <div className = 'd-grid gap-2'>
      <div className="form-floating">
        <input ref = {usernameRef} onChange = {handleChange} type="text" className="form-control" id="username" name = "username" placeholder='UserID'  />
        <label htmlFor="floatingUserName"><h5>User ID</h5></label>
        { usernameVal === true ? null : <p className='fw-bold text-secondary'>영문자로 시작하는 영문 또는 숫자의 6 ~ 20자로 만들어주세요</p>}
      </div>
      <div className="form-floating">
        <input ref = {passwordRef} onChange = {handleChange} type="password" className="form-control" id="password" name = "password" placeholder="Password" />
        <label htmlFor="floatingPassword"><h5>Password</h5></label>
        {user.password === '' ? null :
        <>{passwordval === true ? <p>right password.</p> : <p className='fw-bold text-danger'>영문과 숫자, 특수문자 조합으로 8자리 이상 입력해주세요</p>}</> }
      </div>
      <div className="form-floating">
        <input onChange = {pwCheckChange} type= 'password' className="form-control" id="passwordCheck" name = "checkPwValue" placeholder="Password Check" />      
        <label htmlFor="floatingPassword"><h5>비밀번호를 확인해주세요</h5></label>
      </div>
      {check.checkPwValue === '' ? null :  
      <>{ check.checkPwValue === user.password ? <p>'일치합니다.'</p> || setPasswordSame(true) : <p className='fw-bold text-danger'> 일치하지 않아요 </p> || setPasswordSame(false)} </> }
   
      <div className="form-floating">
        <input ref = {nameRef} onChange = {handleChange} type="text" className="form-control" id="name" name = "name" placeholder="Name" />
        <label htmlFor="floatingName"><h5>Name</h5></label>
        { nameVal === true ? null : <p className='fw-bold text-danger'>2자 이상 10자 미만의 올바른 이름을 입력해주세요.</p>}
      </div>
      <div className="form-floating">
        <input onChange = {handleChange} type="text" className="form-control" id="nickname" name='nickname' placeholder="NickName" />
        <label htmlFor="floatingNickName"><h5>NickName</h5></label>
      </div>
      <div className="form-floating">
        <input ref = {emailRef} onChange = {handleChange} type="text" className="form-control" id="email" name='email' placeholder="E-mail" />
        <label htmlFor="floatingPassword"><h5>E-Mail</h5></label>
        {user.email === '' ? null :  <>{emailVal === true ? <p>올바른 이메일 형식입니다.</p> :  <p className='fw-bold text-danger'>올바르지 않은 이메일 형식입니다.</p>}</> }
      </div>
      <div className="form-floating">
        <input onChange = {handleChange} type="text" className="form-control" id="phone" name='phone' placeholder="Phone Number" />
        <label htmlFor="floatingPhone"><h5>Phone Number</h5></label>
      </div>
      <div className="form-floating">
        <input onChange = {handleChange} type="text" className="form-control" id="weight" name='weight' placeholder="weight" />
        <label htmlFor="floatingWeight"><h5>weight</h5></label>
      </div>
      <div className="form-floating">
        <input onChange = {handleChange} type="text" className="form-control" id="height" name='height' placeholder="height" />
        <label htmlFor="floatingHeight"><h5>height</h5></label>
      </div>
      <div className="form-floating">
        <input onChange = {handleChange} type="text" className="form-control" id="gender" name='gender' placeholder="gender" />
        <label htmlFor="floatingGender"><h5>성별 (남성 혹은 여성으로 작성해주세요)</h5></label>
      </div>

      {/* <div className="form-check form-check-inline">
        <input onChange={checkChange} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"/>
        <label className="form-check-label" htmlFor="inlineRadio1">남성</label>
      </div>
      <div className="form-check form-check-inline">
        <input onChange={checkChange} className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/>
        <label className="form-check-label" htmlFor="inlineRadio2">여성</label>
      </div> */}

      
      <button className="w-100 btn btn-lg btn-outline-secondary"   >
                <h4>Sign Up</h4>
      </button>
      <div className="custom-control custom-checkbox">
        <input type="checkbox" className="custom-control-input" id="aggrement" required />
        <label className="custom-control-label" htmlFor="aggrement">
          <p>개인정보 수집 및 이용에 동의합니다.</p>
        </label>
          </div>
        </div>  
        
            <p className="mt-5 mb-3 text-muted">&copy; TMC 2022</p>
    </form>    
    )
}
export default Join

//Warning: validateDOMNesting(...): <form> cannot appear as a descendant of <form>
// form tag 중복 시 - hydration