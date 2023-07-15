package main

import (
	"context"
	"path/filepath"
	"sync"

	"github.com/Khan/genqlient/graphql"
	pluginapi "github.com/mattermost/mattermost-plugin-api"
	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/plugin"
	"github.com/pkg/errors"
	oauth2 "golang.org/x/oauth2"
)

// Plugin implements the interface expected by the Mattermost server to communicate between the server and plugin processes.
type Plugin struct {
	plugin.MattermostPlugin

	BotUserID string

	client *pluginapi.Client

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration
}

func (p *Plugin) OnActivate() error {

	if p.client == nil {
		p.client = pluginapi.NewClient(p.API, p.Driver)
	}

	config := p.getConfiguration()
	if err := config.IsValid(); err != nil {
		return err
	}

	botID, err := p.client.Bot.EnsureBot(&model.Bot{
		Username:    "wiki.js",
		DisplayName: "wiki js",
		Description: "Created by the GitHub plugin.",
	}, pluginapi.ProfileImagePath(filepath.Join("assets", "wikijs-butterfly.png")))

	if err != nil {
		return errors.Wrap(err, "failed to ensure todo bot")
	}
	p.BotUserID = botID

	// gClient, _ := p.GetOAuth2Client(oauth2.Token{
	// 	AccessToken: p.configuration.AccessToken,
	// }, p.configuration.AccessURL)

	// p.gClient = gClient

	p.API.RegisterCommand(getCommand())

	return nil
}

func (p *Plugin) GetOAuth2Client() (graphql.Client, error) {
	src := oauth2.StaticTokenSource(
		&oauth2.Token{
			AccessToken: p.configuration.AccessToken,
		},
	)
	client := graphql.NewClient(p.configuration.AccessURL+"/graphql", oauth2.NewClient(context.Background(), src))

	return client, nil
}

// ServeHTTP demonstrates a plugin that handles HTTP requests by greeting the world.

// See https://developers.mattermost.com/extend/plugins/server/reference/
