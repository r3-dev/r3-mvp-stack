package main

import (
	"encoding/json"
	"flag"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"

	"github.com/go-chi/chi"
)

type Service struct {
	Name  string   `json:"name"`
	URL   string   `json:"url"`
	Paths []string `json:"paths"`
}

type reverseProxyConfig struct {
	Services []Service `json:"services"`
}

func (c *reverseProxyConfig) get(filename string) *reverseProxyConfig {
	file, err := os.ReadFile(filename)
	if err != nil {
		log.Printf("file.Get err   #%v ", err)
	}
	err = json.Unmarshal(file, c)
	if err != nil {
		log.Fatalf("Unmarshal: %v", err)
	}

	return c
}

func main() {
	log.Println("Starting reverse proxy...")

	// variables declaration
	var port string

	// flags declaration using flag package
	flag.StringVar(&port, "port", "3000", "Specify port. Default is 3000")

	flag.Parse() // after declaring flags we need to call it

	exePath := os.Args[0]
	isDevMode := strings.HasPrefix(exePath, os.TempDir()) || strings.Contains(exePath, "debug")

	var cfg reverseProxyConfig
	if isDevMode {
		cfg.get("config.dev.json")
	} else {
		cfg.get("config.prod.json")
	}

	r := chi.NewRouter()

	// Loop through config and create reverse proxies
	for _, c := range cfg.Services {
		remote, err := url.Parse(c.URL)
		if err != nil {
			panic(err)
		}

		proxy := httputil.NewSingleHostReverseProxy(remote)
		log.Printf("Setting reverse proxy for %s", remote)

		handler := func(p *httputil.ReverseProxy) func(http.ResponseWriter, *http.Request) {
			return func(w http.ResponseWriter, r *http.Request) {
				r.Host = remote.Host
				w.Header().Set("X-Ben", "Rad")
				p.ServeHTTP(w, r)
			}
		}

		for _, p := range c.Paths {
			log.Printf("- mapping path %s", p)

			r.HandleFunc(p, handler(proxy))
		}

	}

	log.Printf("Reverse proxy is running on port %s", port)
	err := http.ListenAndServe(":"+port, r)
	if err != nil {
		panic(err)
	}
}
