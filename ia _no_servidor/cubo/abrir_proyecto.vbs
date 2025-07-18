' iniciar_servidor.vbs
Set objShell = CreateObject("Wscript.Shell")
objShell.Run "python ""servidor_temporal.py""", 0, False
