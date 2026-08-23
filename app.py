from flask import Flask, send_from_directory

app = Flask(__name__)


@app.route("/")
def inicio():
    return send_from_directory(".", "index.html")


@app.route("/<path:archivo>")
def archivos(archivo):
    return send_from_directory(".", archivo)


if __name__ == "__main__":
    app.run(debug=True)