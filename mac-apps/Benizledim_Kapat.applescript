on run
	try
		do shell script "'/Users/gurursonmez/CanvaBenizledim/scripts/benizledim-devctl.sh' stop"
	on error errMsg number errNum
		display dialog "Kapat hata (" & errNum & "): " & errMsg buttons {"OK"} default button "OK" with icon stop
		return
	end try
	display notification "Benizledim kapatildi" with title "Benizledim"
end run
