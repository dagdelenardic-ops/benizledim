on run
	try
		do shell script "'/Users/gurursonmez/CanvaBenizledim/scripts/benizledim-devctl.sh' force-kill"
	on error errMsg number errNum
		display dialog "Force kill hata (" & errNum & "): " & errMsg buttons {"OK"} default button "OK" with icon stop
		return
	end try
	display notification "Benizledim force kill tamam" with title "Benizledim"
end run
