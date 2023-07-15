package main

import (
	"context"
	"fmt"

	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/plugin"
)

func (p *Plugin) UserHasJoinedTeam(c *plugin.Context, teamMember *model.TeamMember, actor *model.User) {
}

func (p *Plugin) ChannelHasBeenCreated(c *plugin.Context, channel *model.Channel) {

	team, _ := p.API.GetTeam(channel.TeamId)

	client, err := p.GetOAuth2Client()

	if err != nil {
		fmt.Println("error log")
	}

	path := createPath(team.Name, channel.Name)
	resp, err := createPage(
		context.Background(),
		client,
		"# "+channel.Name,
		channel.Name+" created by wiki.js.plugin",
		"markdown",
		true,
		false,
		"en",
		path,
		[]string{team.Name},
		channel.Name)

	if err != nil {
		fmt.Println(err)
		post := &model.Post{
			UserId:  p.BotUserID,
			Message: "Fail to create page " + channel.Name + "error Message: " + err.Error(),
		}
		post.ChannelId = channel.Id
		p.API.CreatePost(post)
	}

	if resp.GetPages().Create.ResponseResult.Succeeded {
		post := &model.Post{
			UserId:  p.BotUserID,
			Message: "create page [" + channel.Name + "](" + p.configuration.AccessURL + path + ")",
		}
		post.ChannelId = channel.Id
		p.API.CreatePost(post)
	}
}

func createPath(teamName string, channelName string) string {
	return fmt.Sprintf("/home/%s/%s", teamName, channelName)
}
