on run
	try
		do shell script "'/Users/gurursonmez/CanvaBenizledim/scripts/benizledim-devctl.sh' start"	
	on error errMsg number errNum
		display dialog "Baslat hata (" & errNum & "): " & errMsg buttons {"OK"} default button "OK" with icon stop
		return
	end try
	
	display notification "Benizledim dev server baslatildi" with title "Benizledim"	
	try
		set port to do shell script "cat '/Users/gurursonmez/CanvaBenizledim/.run/dev.port'"
		do shell script "open 'http://127.0.0.1:" & port & "'"
	end try
end run
