var isOpen = false;

function panelOpen(el){
			var settingspanel = document.getElementById("settingspanel");
			if(!isOpen){
			settingspanel.className = "open";
			isOpen = true;	
			}else{
				settingspanel.className = "";
				isOpen = false;
			}
		}
