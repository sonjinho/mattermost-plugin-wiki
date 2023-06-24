package main

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"

	"github.com/mattermost/mattermost-server/v6/model"
	"github.com/mattermost/mattermost-server/v6/plugin"
)

const (
	listPagesCommand  = "list"
	singlePageCommand = "single"
)

var validCommand = map[string]bool{
	listPagesCommand:  true,
	singlePageCommand: true,
}

func getCommand() *model.Command {
	return &model.Command{
		Trigger:          "wikijs",
		DisplayName:      "Wiki.Js Bot",
		Description:      "Interact with your Wiki.js",
		AutoComplete:     true,
		AutoCompleteDesc: "Available command: list",
		AutoCompleteHint: "[command]",
		AutocompleteData: getAutoCompleteData(),
	}
}

func (p *Plugin) ExecuteCommand(c *plugin.Context, args *model.CommandArgs) (*model.CommandResponse, *model.AppError) {
	spaceRegExp := regexp.MustCompile(`\s+`)
	trimmedArgs := spaceRegExp.ReplaceAllString(strings.TrimSpace(args.Command), " ")
	stringArgs := strings.Split(trimmedArgs, " ")
	lengthOfArgs := len(stringArgs)
	restOfArgs := []string{}

	var handler func([]string, *model.CommandArgs) (bool, error)
	if lengthOfArgs == 1 {
		handler = p.runListCommand
	}
	handler = p.runListCommand
	isUserError, err := handler(restOfArgs, args)
	if err != nil {
		if isUserError {
			fmt.Println(err.Error())
		}
	}
	return &model.CommandResponse{}, nil
}

func (p *Plugin) runListCommand(args []string, extra *model.CommandArgs) (bool, error) {

	// src := oauth2.StaticTokenSource(
	// 	&oauth2.Token{AccessToken: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjIsImdycCI6MSwiaWF0IjoxNjg3NDM1NjQ4LCJleHAiOjE3MTg5OTMyNDgsImF1ZCI6InVybjp3aWtpLmpzIiwiaXNzIjoidXJuOndpa2kuanMifQ.IMwo1AvpZbUnyCEGlTCK9YrRyb7t4dLbzU0MKhToUYgdoXEh7QAP8KsD-D03FMt9n9msqiGCVuZTVMmrfp5XMqlfsAyLWXzECdwzsskyeS9PiBJis4UG4_zIvsDQlZwW5D6sd2mT-ceoY8nZa2KP5fLzXXf191cxuMN2vfqLbTOBZrXmxrUh4H8qoRdKN45YPXU8zHoQpioOas79zl4wsDqX2Us4XZKBsJxYCyiwlO96_TS3l2rx8sHa5TFSCAFfA27lsDGHOc8nOlJ-CUMXhGyqT8nFnMdtrVQwQUmeIt0nfnr8XOUbCR4RKbNeRDUMrty3lYT6X-Qq3wmhTN37Jg"},
	// )
	// httpClient := oauth2.NewClient(context.Background(), src)

	// client := graphql.NewClient("http://localhost:3000/graphql", httpClient)

	graphqlClient, _ := p.GetOAuth2Client()

	resp, err := listPages(context.Background(), graphqlClient, PageOrderByCreated)

	if err != nil {
		fmt.Print("error")
	}

	b, _ := json.Marshal(resp.GetPages().List)
	p.postCommandResponse(extra, string(b))

	return false, nil
}

func (p *Plugin) postCommandResponse(args *model.CommandArgs, text string) {
	post := &model.Post{
		UserId:    p.BotUserID,
		ChannelId: args.ChannelId,
		Message:   text,
	}
	_ = p.API.SendEphemeralPost(args.UserId, post)
}

func getAutoCompleteData() *model.AutocompleteData {
	wikijs := model.NewAutocompleteData("wikijs", "[command]", "Available commands: list")
	list := model.NewAutocompleteData("list", "[order]", "Lists your wiki")
	items := []model.AutocompleteListItem{
		{
			HelpText: "OrderById",
			Hint:     "(optional)",
			Item:     "id",
		}, {
			HelpText: "OrderByTime",
			Hint:     "(optional)",
			Item:     "time",
		},
	}

	list.AddStaticListArgument("Lists your wiki.js", false, items)
	wikijs.AddCommand(list)
	return wikijs
}
