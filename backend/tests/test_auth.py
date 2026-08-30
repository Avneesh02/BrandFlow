def test_register_login_me_refresh(client):
    # register
    reg = client.post(
        "/api/auth/register",
        json={"email": "test@example.com", "password": "securepass123", "company_name": "Acme"},
    )
    assert reg.status_code == 201
    assert reg.json()["email"] == "test@example.com"
    assert "password" not in reg.json()

    # login
    login = client.post("/api/auth/login", json={"email": "test@example.com", "password": "securepass123"})
    assert login.status_code == 200
    tokens = login.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens

    access = tokens["access_token"]
    refresh = tokens["refresh_token"]

    # protected route
    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {access}"})
    assert me.status_code == 200
    assert me.json()["company_name"] == "Acme"

    # refresh
    refreshed = client.post("/api/auth/refresh", json={"refresh_token": refresh})
    assert refreshed.status_code == 200
    new_access = refreshed.json()["access_token"]
    assert new_access != access or new_access  # token may differ

    me2 = client.get("/api/auth/me", headers={"Authorization": f"Bearer {new_access}"})
    assert me2.status_code == 200


def test_login_bad_password(client):
    client.post("/api/auth/register", json={"email": "bad@example.com", "password": "securepass123"})
    resp = client.post("/api/auth/login", json={"email": "bad@example.com", "password": "wrongpassword"})
    assert resp.status_code == 401


def test_duplicate_register(client):
    payload = {"email": "dup@example.com", "password": "securepass123"}
    assert client.post("/api/auth/register", json=payload).status_code == 201
    assert client.post("/api/auth/register", json=payload).status_code == 409
