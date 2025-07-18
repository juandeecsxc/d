# servidor_temporal.py
import os
import time
import socket
import http.server
import socketserver
import threading

PUERTO = 8000
TIEMPO_ESPERA = 60 * 30  # 30 minutos

def puerto_ocupado(puerto):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', puerto)) == 0

if puerto_ocupado(PUERTO):
    print(f"⚠️ El puerto {PUERTO} ya está en uso. Cerrando servidor anterior...")
    os.system(f"powershell -Command \"Get-NetTCPConnection -LocalPort {PUERTO} | ForEach-Object {{ Stop-Process -Id $_.OwningProcess -Force }}\"")

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Oculta los logs del servidor

def abrir_navegador():
    time.sleep(1)  # Espera un segundo para que el servidor arranque
    os.system(f'start http://localhost:{PUERTO}/index.html')

def cerrar_automaticamente(httpd):
    time.sleep(TIEMPO_ESPERA)
    print("⏱ Tiempo agotado. Cerrando servidor...")
    httpd.shutdown()

def main():
    os.chdir(os.path.dirname(__file__))
    with socketserver.TCPServer(("", PUERTO), Handler) as httpd:
        threading.Thread(target=abrir_navegador).start()
        threading.Thread(target=cerrar_automaticamente, args=(httpd,)).start()
        print(f"✅ Servidor corriendo en http://localhost:{PUERTO}")
        httpd.serve_forever()

if __name__ == "__main__":
    main()
