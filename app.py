from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import math
import os

app = Flask(__name__)
CORS(app) # Important pour que React puisse appeler l'API

# Connexion à PostgreSQL Railway
def get_db_connection():
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    return conn

# Formule pour calculer distance en km
def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

@app.route('/api/cs-proches', methods=['GET'])
def cs_proches():
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nom, quartier, latitude, longitude, telephone FROM centres_sante;')
    centres = cur.fetchall()
    cur.close()
    conn.close()

    resultats = []
    for c in centres:
        distance = haversine(lat, lon, c[3], c[4])
        resultats.append({
            "id": c[0],
            "nom": c[1],
            "quartier": c[2],
            "distance": round(distance, 1),
            "tel": c[5]
        })

    # Trie par distance et prend les 3 plus proches
    resultats.sort(key=lambda x: x['distance'])
    return jsonify(resultats[:3])

@app.route('/')
def home():
    return "Doktè Bot API is running"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)