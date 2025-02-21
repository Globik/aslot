 const login = function(n){
	 return `<a href="#."  class="overlay" id="login"></a>
    <output id="loginoutput" class="popi">
        <div class="modal-header">Авторизация / Регистрация</div>
      
        <div class="modal-body">
          <div class="error-message" id="errormsg"></div>
         <form name="formlogin" id="myform">
            <label for="name" class="lb" style="margin-top: 5px;">Имя </label>
            <input  class="inp" name="username" type="text" placeholder="Введите имя" id="name" required minlength="2" maxlength="20">

            <label for="name" class="lb">Пароль</label>
            <input  class="inp" name="userpassword" type="password" autocomplete="on" placeholder="Введите пароль" id="password" required minlength="2" maxlength="20">
			 <button  class="login-button" id="btnlogin">Войти</button>
         <button class="register-button" id="btnregister">Зарегистрироваться</button>
          </form> </div>
    </output>
    <script src="/js/login.js"></script>`;
}
module.exports = { login }
