package main

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/mattermost/mattermost-server/v6/plugin"
)

type Node struct {
	Key   string `json:"key"`
	Label string `json:"label"`
	URL   string `json:"url"`
	Nodes []Node `json:"nodes"`
}

func convertListToNode(nodes *[]Node, path string, title string, url string) {
	if len(*nodes) == 0 {
		*nodes = append(*nodes, Node{
			Key:   path,
			Label: title,
			URL:   url,
			Nodes: make([]Node, 0),
		})
		return
	}
	if !strings.Contains(path, "/") {
		*nodes = append(*nodes, Node{
			Key:   path,
			Label: title,
			URL:   url,
			Nodes: make([]Node, 0),
		})
		return
	}

	index := strings.Index(path, "/")

	if index != -1 {
		path = path[index+1:]
		for i := range *nodes {
			if strings.Contains(url, (*nodes)[i].URL) {
				convertListToNode(&(*nodes)[i].Nodes, path, title, url)
				return
			}
		}
	}

	*nodes = append(*nodes, Node{
		Key:   path,
		Label: title,
		URL:   url,
		Nodes: make([]Node, 0),
	})

}

func (p *Plugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("Mattermost-User-ID")
	if userID == "" {
		http.Error(w, "Not authorized", http.StatusUnauthorized)
		return
	}
	switch r.URL.Path {
	case "/list":

		client, _ := p.GetOAuth2Client()

		resp, err := listPages(context.Background(), client)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		// json.NewEncoder(w).Encode(resp.Pages.GetList())

		nodes := make([]Node, 0)
		for _, item := range resp.Pages.GetList() {
			path := item.GetPath()
			title := item.GetTitle()
			url := p.configuration.AccessURL + "/" + item.Locale + "/" + path
			convertListToNode(&nodes, path, title, url)
		}
		json.NewEncoder(w).Encode(nodes)

		return

	default:
		path := r.URL.Path
		http.Redirect(w, r, strings.TrimSuffix(p.configuration.AccessURL, "graphql")+path, http.StatusSeeOther)
		return
	}
}
