from flask import Flask, request, session, g, redirect, url_for, \
                  abort, render_template, flash

# configuration
DATABASE = '/tmp/dental_flask_app.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin' #necessary?
PASSWORD = 'default' #necessary?

# create the app
app = Flask(__name__)

# configure the app (from ALL CAP strings, above)
app.config.from_object(__name__)

############
# Routing methods
############

@app.route('/')
def render_index():
    return render_template('index.html')

# requisite logic for launching from source
if __name__ == '__main__':
    app.run()

