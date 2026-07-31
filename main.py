import sys
import os
import http.server
import socketserver
import threading
import socket

os.environ["QT_ENABLE_HIGHDPI_SCALING"] = "0"
os.environ["QT_AUTO_SCREEN_SCALE_FACTOR"] = "0"
os.environ["QTWEBENGINE_CHROMIUM_FLAGS"] = (
    "--autoplay-policy=no-user-gesture-required "
    "--disable-pinch "
    "--enable-gpu-rasterization "
    "--ignore-gpu-blocklist "
    "--enable-zero-copy "
    "--disable-scroll-bars "
    "--log-level=3 "
    "--disable-logging"
)

from PySide6.QtCore import Qt, QUrl, QTimer
from PySide6.QtWidgets import QApplication, QMainWindow
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtGui import QIcon, QShortcut, QKeySequence

def get_base_dir():
    if hasattr(sys, '_MEIPASS'):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))

def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

    def handle_error(self, request, client_address):
        """Suppress expected connection reset errors when Chromium cancels requests."""
        exctype = sys.exc_info()[0]
        if exctype in (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
            return
        super().handle_error(request, client_address)

class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'max-age=86400, public')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def copyfile(self, source, outputfile):
        """Ignore socket write errors when client disconnects early."""
        try:
            super().copyfile(source, outputfile)
        except (ConnectionResetError, BrokenPipeError, ConnectionAbortedError):
            pass

def start_local_server(web_dir, port):
    os.chdir(web_dir)
    httpd = ThreadedHTTPServer(('127.0.0.1', port), QuietHTTPRequestHandler)
    httpd.serve_forever()

class NavigatorsWindow(QMainWindow):
    def __init__(self, url, icon_path):
        super().__init__()
        self.setWindowTitle("Navigators")
        self.resize(1280, 720)

        if os.path.exists(icon_path):
            app_icon = QIcon(icon_path)
            self.setWindowIcon(app_icon)
            QApplication.setWindowIcon(app_icon)

        self.browser = QWebEngineView()
        self.browser.setContextMenuPolicy(Qt.NoContextMenu)
        self.setCentralWidget(self.browser)
        self.browser.load(QUrl(url))

        self.fullscreen_shortcut = QShortcut(QKeySequence("F11"), self)
        self.fullscreen_shortcut.activated.connect(self.toggle_fullscreen)

    def toggle_fullscreen(self):
        if self.isFullScreen():
            self.showNormal()
        else:
            self.showFullScreen()

def main():
    base_dir = get_base_dir()
    web_dir = os.path.join(base_dir, "web")
    icon_path = os.path.join(web_dir, "boss.png")

    port = find_free_port()
    server_thread = threading.Thread(target=start_local_server, args=(web_dir, port), daemon=True)
    server_thread.start()

    if sys.platform == "win32":
        try:
            import ctypes
            ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID("Navigators.Game.App.1.0")
        except Exception:
            pass

    app = QApplication(sys.argv)
    window = NavigatorsWindow(f"http://127.0.0.1:{port}/index.html", icon_path)
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()